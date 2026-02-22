import { Alert, Form, Tabs } from 'antd';
import { Rule } from 'antd/es/form';
import { cloneElement, useContext, useEffect, useMemo, useState } from 'react';
import { CheckCircleTwoTone, WarningTwoTone } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import DisabledContext from 'antd/es/config-provider/DisabledContext';
import { useTenantAdminData } from '../../hooks/useTenantAdminData.hook';
import styles from './styles.module.scss';

export interface TranslatableFormFieldProps {
    name: string | string[];
    children: React.ReactElement;
}

export const TranslatableFormField = ({ name, children }: TranslatableFormFieldProps) => {
    const { t } = useTranslation();
    const { data: tenantData } = useTenantAdminData();
    const namePath = useMemo(() => (name instanceof Array ? name : [name]), [name]);
    const isDisabled = useContext(DisabledContext);
    const form = Form.useFormInstance();
    // useWatch is undefined on the first render before the store is hydrated with initialValues.
    // Fall back to form.getFieldValue which is synchronous and includes initialValues immediately.
    const watchedData = Form.useWatch(namePath);
    const fieldData = watchedData ?? form.getFieldValue(namePath);

    const languages = useMemo(
        () => tenantData?.settings?.activeLanguages || ['de'],
        [tenantData?.settings?.activeLanguages],
    );

    const [activeTab, setActiveTab] = useState(() => languages[0] || 'de');

    // Sync active tab if languages change (e.g. tenant settings updated)
    useEffect(() => {
        if (!languages.includes(activeTab)) {
            setActiveTab(languages[0] || 'de');
        }
    }, [languages, activeTab]);

    // Reactively detect empty languages via Form.useWatch
    const emptyLanguages = useMemo(
        () => languages.filter((lng) => !fieldData?.[lng]),
        [languages, fieldData],
    );

    // Clone child with correct name and strip required-blocking rules
    const cloneForLanguage = (language: string) => {
        const overrides: Record<string, unknown> = {
            name: [...namePath, language],
            // Strip required prop for FormBaseInputField-based components
            required: false,
        };

        // Strip required rules for FormPluginEditor (uses itemProps)
        if (children.props.itemProps) {
            overrides.itemProps = {
                ...children.props.itemProps,
                rules: (children.props.itemProps.rules || []).filter((r: Rule) =>
                    typeof r === 'function' ? true : !r.required,
                ),
            };
        }

        return cloneElement(children, overrides);
    };

    // Single language: no tabs needed, just clone with correct name
    if (languages.length === 1) {
        return cloneForLanguage(languages[0]);
    }

    const tabItems = languages.map((language) => ({
        key: language,
        label: (
            <span className={styles.tabLabel}>
                {t(`language.${language}`)}
                {emptyLanguages.includes(language) ? (
                    <WarningTwoTone twoToneColor="#FF9F00" />
                ) : (
                    <CheckCircleTwoTone twoToneColor="#4FCC5C" />
                )}
            </span>
        ),
        children: cloneForLanguage(language),
    }));

    return (
        <div className={styles.wrapper}>
            <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
            {!isDisabled && emptyLanguages.length > 0 && (
                <Alert
                    type="warning"
                    showIcon
                    message={`${t('form.errors.fillAllLanguages')}: ${emptyLanguages.map((lng) => t(`language.${lng}`)).join(', ')}`}
                    className={styles.warningAlert}
                />
            )}
        </div>
    );
};

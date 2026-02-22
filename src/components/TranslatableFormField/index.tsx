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

    // Watch ALL form values so we react to every language field change.
    // Watching only `namePath` misses updates because no Form.Item is registered
    // at that exact path – only at the deeper [...namePath, language] paths.
    const allValues = Form.useWatch([]);

    // Extract the language sub-object from the watched values.
    // Fall back to getFieldsValue(true) which reads the full store (including
    // initialValues) even before Form.Items have registered (first render).
    const fieldData = useMemo(() => {
        const values = allValues ?? form.getFieldsValue(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return namePath.reduce((acc: any, key) => acc?.[key], values ?? {});
    }, [allValues, namePath, form]);

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
        // forceRender ensures all editors mount on first render so their
        // Form.Items register values immediately – no lazy-loading surprise.
        forceRender: true,
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

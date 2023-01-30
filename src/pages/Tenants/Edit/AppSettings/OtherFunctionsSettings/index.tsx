import { useTranslation } from 'react-i18next';
import { CardEditable } from '../../../../../components/CardEditable';
import { FormSwitchField } from '../../../../../components/FormSwitchField';
import { useSingleTenantData } from '../../../../../hooks/useSingleTenantData';
import { useTenantAdminDataMutation } from '../../../../../hooks/useTenantAdminDataMutation.hook';
import styles from './styles.module.scss';

export const OtherFunctionsSettings = ({ tenantId }: { tenantId: string }) => {
    const { t } = useTranslation();
    const { data, isLoading } = useSingleTenantData({ id: tenantId });
    const { mutate } = useTenantAdminDataMutation({ id: tenantId });

    return (
        <CardEditable
            isLoading={isLoading}
            initialValues={{ ...data }}
            titleKey="tenants.appSettings.otherFunctions.title"
            onSave={mutate}
        >
            <div className={styles.checkGroup}>
                <FormSwitchField
                    labelKey="tenants.appSettings.otherFunctions.allowTopicCreation.title"
                    name={['settings', 'featureTopicsEnabled']}
                    inline
                    disableLabels
                />
                <p className={styles.checkInfo}>
                    {t('tenants.appSettings.otherFunctions.allowTopicCreation.description')}
                </p>
            </div>
            <div className={styles.checkGroup}>
                <FormSwitchField
                    labelKey="tenants.appSettings.otherFunctions.statistics.title"
                    name={['settings', 'featureStatisticsEnabled']}
                    inline
                    disableLabels
                />
                <p className={styles.checkInfo}>{t('tenants.appSettings.otherFunctions.statistics.description')}</p>
            </div>
        </CardEditable>
    );
};

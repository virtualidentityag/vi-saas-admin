import { useTranslation } from 'react-i18next';
import { CardEditable } from '../../../CardEditable';
import { FormSwitchField } from '../../../FormSwitchField';
import { useSingleTenantData } from '../../../../hooks/useSingleTenantData';
import { useTenantAdminDataMutation } from '../../../../hooks/useTenantAdminDataMutation.hook';
import styles from './styles.module.scss';

export const CommunicationSettings = ({ tenantId }: { tenantId: string }) => {
    const { t } = useTranslation();
    const { data, isLoading } = useSingleTenantData({ id: tenantId });
    const { mutate } = useTenantAdminDataMutation({
        id: tenantId,
        successMessageKey: 'tenants.message.settingsUpdate',
    });

    return (
        <CardEditable
            isLoading={isLoading}
            initialValues={{ ...data }}
            titleKey="tenants.appSettings.communications.title"
            onSave={mutate}
        >
            <div className={styles.checkGroup}>
                <FormSwitchField
                    labelKey="tenants.appSettings.communications.video.title"
                    name={['settings', 'extendedSettings', 'isVideoCallAllowed']}
                    inline
                    disableLabels
                />
                <p className={styles.checkInfo}>{t('tenants.appSettings.communications.video.description')}</p>
            </div>
            <div className={styles.checkGroup}>
                <FormSwitchField
                    labelKey="tenants.appSettings.communications.allowAttachments.title"
                    name={['settings', 'featureAttachmentUploadDisabled']}
                    inverseValue
                    inline
                    disableLabels
                />
            </div>
        </CardEditable>
    );
};

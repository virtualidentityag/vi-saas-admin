import { useTranslation } from 'react-i18next';
import { CardEditable } from '../../../../../components/CardEditable';
import { FormSwitchField } from '../../../../../components/FormSwitchField';
import styles from './styles.module.scss';

export const CommunicationSettings = () => {
    const { t } = useTranslation();
    const isLoading = false;

    return (
        <CardEditable
            isLoading={isLoading}
            initialValues={{}}
            titleKey="tenants.appSettings.communications.title"
            onSave={null}
        >
            <div className={styles.checkGroup}>
                <FormSwitchField
                    labelKey="tenants.appSettings.communications.video.title"
                    name="a"
                    inline
                    disableLabels
                />
                <p className={styles.checkInfo}>{t('tenants.appSettings.communications.video.description')}</p>
            </div>
            <div className={styles.checkGroup}>
                <FormSwitchField
                    labelKey="tenants.appSettings.communications.allowAttachments.title"
                    name="b"
                    inline
                    disableLabels
                />
            </div>
        </CardEditable>
    );
};

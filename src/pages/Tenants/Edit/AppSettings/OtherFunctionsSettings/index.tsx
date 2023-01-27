import { useTranslation } from 'react-i18next';
import { CardEditable } from '../../../../../components/CardEditable';
import { FormSwitchField } from '../../../../../components/FormSwitchField';
import styles from './styles.module.scss';

export const OtherFunctionsSettings = () => {
    const { t } = useTranslation();
    const isLoading = false;

    return (
        <CardEditable
            isLoading={isLoading}
            initialValues={{}}
            titleKey="tenants.appSettings.otherFunctions.title"
            onSave={null}
        >
            <div className={styles.checkGroup}>
                <FormSwitchField
                    labelKey="tenants.appSettings.otherFunctions.allowTopicCreation.title"
                    name="a"
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
                    name="b"
                    inline
                    disableLabels
                />
                <p className={styles.checkInfo}>{t('tenants.appSettings.otherFunctions.statistics.description')}</p>
            </div>
        </CardEditable>
    );
};

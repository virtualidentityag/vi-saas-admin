import { Divider, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { CardEditable } from '../../../../../components/CardEditable';
import { FormRadioGroupField } from '../../../../../components/FormRadioGroupField';
import { FormSwitchField } from '../../../../../components/FormSwitchField';
import styles from './styles.module.scss';

export const NotificationsSettings = () => {
    const { t } = useTranslation();
    const isLoading = false;

    return (
        <CardEditable
            isLoading={isLoading}
            initialValues={{}}
            titleKey="tenants.appSettings.notifications.title"
            onSave={null}
        >
            <div className={styles.checkGroup}>
                <FormSwitchField labelKey="tenants.appSettings.welcomeMessage.label" name="a" inline disableLabels />
                <p className={styles.checkInfo}>{t('tenants.appSettings.welcomeMessage.description')}</p>
            </div>
            <div className={styles.checkGroup}>
                <FormSwitchField labelKey="tenants.appSettings.nextSteps.label" name="b" inline disableLabels />
                <p className={styles.checkInfo}>{t('tenants.appSettings.nextSteps.description')}</p>
            </div>
            <div className={styles.checkGroup}>
                <FormSwitchField labelKey="tenants.appSettings.sessionData.label" name="c" inline disableLabels />
            </div>
            <Divider />
            <div className={styles.radioGroup}>
                <FormRadioGroupField
                    labelKey="tenants.appSettings.notifications.info"
                    name="asd"
                    className={styles.notifications}
                >
                    <Space direction="vertical">
                        <FormRadioGroupField.Radio value="d">
                            {t('tenants.appSettings.notifications.option.onlyConsultant')}
                        </FormRadioGroupField.Radio>
                        <FormRadioGroupField.Radio value="e">
                            {t('tenants.appSettings.notifications.option.allTeamConsultants')}
                        </FormRadioGroupField.Radio>
                    </Space>
                </FormRadioGroupField>
            </div>
        </CardEditable>
    );
};

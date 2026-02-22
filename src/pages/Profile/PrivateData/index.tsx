import { App } from 'antd';
import { useTranslation } from 'react-i18next';
import { CardEditable } from '../../../components/CardEditable';
import { FormInputField } from '../../../components/FormInputField';
import { useUpdateUserData } from '../../../hooks/useUpdateUserData.hook';
import { useUserData } from '../../../hooks/useUserData.hook';

export const PrivateData = () => {
    const { notification } = App.useApp();
    const { t } = useTranslation();
    const { data, isLoading } = useUserData();
    const { mutate: updateData } = useUpdateUserData({
        onSuccess: () => {
            notification.success({ message: t('profile.privateData.success'), duration: 3 });
        },
    });

    return (
        <CardEditable
            isLoading={isLoading}
            titleKey="profile.privateData.title"
            initialValues={data && { ...data }}
            onSave={updateData}
        >
            <FormInputField name="firstname" labelKey="firstname" placeholderKey="placeholder.firstname" required />
            <FormInputField name="lastname" labelKey="lastname" placeholderKey="placeholder.lastname" required />
            <FormInputField name="email" labelKey="email" placeholderKey="placeholder.email" required />
        </CardEditable>
    );
};

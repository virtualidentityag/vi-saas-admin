import { CardEditable } from '../../../components/CardEditable';
import { FormInputField } from '../../../components/FormInputField';
import { useUpdateUserData } from '../../../hooks/useUpdateUserData.hook';
import { useUserData } from '../../../hooks/useUserData.hook';

export const PrivateData = () => {
    const { data, isLoading } = useUserData();
    const { mutate: updateData } = useUpdateUserData();

    return (
        <CardEditable
            isLoading={isLoading}
            titleKey="profile.privateData.title"
            initialValues={{ ...data }}
            onSave={updateData as any}
        >
            <FormInputField name="firstName" labelKey="firstname" placeholderKey="placeholder.firstname" required />
            <FormInputField name="lastName" labelKey="lastname" placeholderKey="placeholder.lastname" required />
            <FormInputField name="email" labelKey="email" placeholderKey="placeholder.lastname" required />
        </CardEditable>
    );
};

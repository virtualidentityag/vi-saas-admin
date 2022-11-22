import { message } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAgencyData } from '../../../../../hooks/useAgencyData';
import { useAgencyUpdate } from '../../../../../hooks/useAgencyUpdate';
import { FormInputField } from '../../../../FormInputField';
import { FormTextAreaField } from '../../../../FormTextAreaField';
import { CardEditable } from '../CardEditable';

export const AgencyGeneralInformation = ({ id }: { id: string }) => {
    const [t] = useTranslation();
    const { mutate } = useAgencyUpdate(id);
    const { data, isLoading, refetch } = useAgencyData(id);

    const saveInfo = useCallback((formData) => {
        mutate(formData, {
            onSuccess: () => {
                refetch();
                message.success({
                    content: t('message.agency.update'),
                    duration: 3,
                });
            },
        });
    }, []);

    return (
        <CardEditable
            isLoading={isLoading}
            initialValues={{ ...data }}
            titleKey="agency.edit.general.general_information"
            onSave={saveInfo}
        >
            <FormInputField
                name="name"
                labelKey="agency.edit.general.general_information.name"
                placeholderKey="agency.edit.general.general_information.name"
                required
            />

            <FormTextAreaField
                name="description"
                labelKey="agency.edit.general.general_information.description"
                placeholderKey="agency.edit.general.general_information.description"
            />
        </CardEditable>
    );
};

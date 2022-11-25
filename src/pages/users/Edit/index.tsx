import { ChevronLeft } from '@mui/icons-material';
import { message, Space } from 'antd';
import { useForm, useWatch } from 'antd/lib/form/Form';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import { CardEditable } from '../../../components/Agency/AgencyEdit/components/CardEditable';
import { Button, BUTTON_TYPES } from '../../../components/button/Button';
import { FormInputField } from '../../../components/FormInputField';
import { FormTextAreaField } from '../../../components/FormTextAreaField';
import { Page } from '../../../components/Page';
import { SelectFormField } from '../../../components/SelectFormField';
import { SwitchFormField } from '../../../components/SwitchFormField';
import { useAddOrUpdateConsultant } from '../../../hooks/useAddOrUpdateConsultant';
import { useAgenciesData } from '../../../hooks/useAgencysData';
import { useConsultantsData } from '../../../hooks/useConsultantsData';
import { convertToOptions } from '../../../utils/convertToOptions';
import { decodeUsername } from '../../../utils/encryptionHelpers';

export const UserEditOrAdd = () => {
    const navigate = useNavigate();
    const [form] = useForm();
    const { t } = useTranslation();
    const { typeOfUsers, id } = useParams();
    // Todo: Temporary solution
    const { data: consultantsResponse, isLoading: isLoadingConsultants } = useConsultantsData({ pageSize: 10000 });
    const { data: agenciesData, isLoading } = useAgenciesData({ pageSize: 200 });
    const isEditing = id !== 'add';
    const singleData = consultantsResponse?.data.find((c) => c.id === id);

    const { mutate } = useAddOrUpdateConsultant({
        id: isEditing ? id : null,
        onSuccess: (response) => {
            message.success({
                content: t('message.counselor.update'),
                duration: 3,
            });
            navigate(`/admin/users/${typeOfUsers}/${response.id}`);
        },
    });

    const onSave = useCallback((data) => mutate(data), []);
    const onCancel = useCallback(() => navigate(`/admin/users/${typeOfUsers}`), []);

    return (
        <Page isLoading={isLoadingConsultants || isLoading}>
            <div className="agencyEdit__headerBack">
                <NavLink to={`/admin/users/${typeOfUsers}`}>
                    <ChevronLeft />
                    <h3 className="agencyEdit__header--headline">{t('agency.add.general.headline')}</h3>
                </NavLink>
            </div>

            <CardEditable
                isLoading={isLoading}
                initialValues={{
                    ...(singleData || {}),
                    username: decodeUsername(singleData?.username || ''),
                    agencies: convertToOptions(singleData?.agencies || [], 'name', 'id'),
                }}
                titleKey="agency.edit.general.general_information"
                onSave={onSave}
                onAddMode={!isEditing}
                formProp={form}
            >
                <FormInputField name="firstname" labelKey="firstname" placeholderKey="placeholder.firstname" required />
                <FormInputField name="lastname" labelKey="lastname" placeholderKey="placeholder.lastname" required />
                <FormInputField
                    name="email"
                    labelKey="email"
                    placeholderKey="placeholder.email"
                    rules={[
                        {
                            required: true,
                            type: 'email',
                            message: t('message.error.email.incorrect'),
                        },
                    ]}
                />

                <SelectFormField
                    name="agencies"
                    label="agency"
                    labelInValue
                    isMulti
                    options={convertToOptions(agenciesData?.data || [], 'name', 'id')}
                />

                <FormInputField
                    name="username"
                    labelKey="counselor.username"
                    placeholderKey="placeholder.username"
                    required
                />
                <Space align="center">
                    <SwitchFormField label="counselor.formalLanguage" name="formalLanguage" />
                    {isEditing && <SwitchFormField label="plsSelect" name="absent" />}
                </Space>
                {useWatch('absent', form) && (
                    <FormTextAreaField labelKey="counselor.absenceMessage" name="absenceMessage" />
                )}
            </CardEditable>

            {!isEditing && (
                <div className="agencyAdd_actions agencyAdd_actions--sticky">
                    <Button
                        item={{ label: t('agency.add.general.cancel'), type: BUTTON_TYPES.SECONDARY }}
                        buttonHandle={onCancel}
                    />
                    <Button
                        item={{ label: t('agency.add.general.save'), type: BUTTON_TYPES.PRIMARY }}
                        buttonHandle={() => form.submit()}
                    />
                </div>
            )}
        </Page>
    );
};

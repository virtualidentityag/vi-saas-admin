import { App, Button, Space } from 'antd';
import { useForm, useWatch } from 'antd/es/form/Form';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { FETCH_ERRORS, X_REASON } from '../../../api/fetchData';
import { CardEditable } from '../../../components/CardEditable';
import { FormInputField } from '../../../components/FormInputField';
import { FormTextAreaField } from '../../../components/FormTextAreaField';
import { Page } from '../../../components/Page';
import { SelectFormField } from '../../../components/SelectFormField';
import { PermissionAction } from '../../../enums/PermissionAction';
import { Resource } from '../../../enums/Resource';
import { TypeOfUser } from '../../../enums/TypeOfUser';
import { useAddOrUpdateConsultantOrAdmin } from '../../../hooks/useAddOrUpdateConsultantOrAgencyAdmin';
import { useAgenciesData } from '../../../hooks/useAgencysData';
import { useConsultantsOrAdminsData } from '../../../hooks/useConsultantsOrAdminsData';
import { useUserPermissions } from '../../../hooks/useUserPermission';
import { convertToOptions } from '../../../utils/convertToOptions';
import { decodeUsername } from '../../../utils/encryptionHelpers';
import { FormSwitchField } from '../../../components/FormSwitchField';
import { useFeatureContext } from '../../../context/FeatureContext';
import { FeatureFlag } from '../../../enums/FeatureFlag';
import { Reset2FAModal } from '../../../components/Reset2FAModal';

export const UserEditOrAdd = () => {
    const { notification } = App.useApp();
    const navigate = useNavigate();
    const [form] = useForm();
    const { can } = useUserPermissions();
    const { t } = useTranslation();
    const { isEnabled } = useFeatureContext();
    const { typeOfUsers, id } = useParams<{ id: string; typeOfUsers: TypeOfUser }>();
    const [showReset2FAModal, setShowReset2FAModal] = useState(false);
    const { data: consultantsResponse, isLoading: isLoadingConsultants } = useConsultantsOrAdminsData({
        search: id,
        typeOfUser: typeOfUsers,
        enabled: !!id,
    });
    const { data: agenciesData, isLoading } = useAgenciesData({ pageSize: 10000 });
    const isEditing = id !== 'add';
    const singleData = consultantsResponse?.data.find((c) => c.id === id);

    const { mutate } = useAddOrUpdateConsultantOrAdmin({
        id: isEditing ? id : null,
        typeOfUser: typeOfUsers,
        onSuccess: (response) => {
            notification.success({
                message: t(`message.counselor.${isEditing ? 'update' : 'add'}`),
                duration: 3,
            });
            navigate(`/admin/users/${typeOfUsers}/${response.id}`);
        },
        onError: (error: Error | Response) => {
            if (error instanceof Response) {
                switch (error.headers.get(FETCH_ERRORS.X_REASON)) {
                    case X_REASON.EMAIL_NOT_AVAILABLE: {
                        const isAllowed =
                            can(PermissionAction.Delete, Resource.Consultant) && typeOfUsers === TypeOfUser.Consultants;
                        notification.error({
                            message: t(
                                `${isAllowed ? '' : 'notAllowed.'}message.error.${error.headers.get(
                                    FETCH_ERRORS.X_REASON,
                                )}`,
                            ),
                            duration: 3,
                        });
                        break;
                    }
                    case X_REASON.NUMBER_OF_LICENSES_EXCEEDED:
                        notification.error({
                            message: t('message.error.NUMBER_OF_LICENSES_EXCEEDED'),
                            duration: 3,
                        });
                        break;
                    default:
                        notification.error({
                            message: t('message.error.default'),
                            duration: 3,
                        });
                        break;
                }
            }
        },
    });

    const onSave = useCallback((data) => mutate(data), []);
    const onCancel = useCallback(() => navigate(`/admin/users/${typeOfUsers}`), []);
    const isAbsentEnabled = useWatch('absent', form);

    return (
        <Page isLoading={isLoadingConsultants || isLoading}>
            <Page.BackWithActions path={`/admin/users/${typeOfUsers}`} titleKey="agency.add.general.headline">
                {isEditing && typeOfUsers === 'consultants' && can(PermissionAction.Update, Resource.Consultant) && (
                    <Button onClick={() => setShowReset2FAModal(true)}>
                        {t('counselor.reset2fa')}
                    </Button>
                )}
                {!isEditing && (
                    <>
                        <Button type="default" onClick={onCancel}>
                            {t('btn.cancel')}
                        </Button>
                        <Button type="primary" onClick={() => form.submit()}>
                            {t('save')}
                        </Button>
                    </>
                )}
            </Page.BackWithActions>

            <CardEditable
                isLoading={isLoading}
                initialValues={{
                    ...(singleData || {
                        formalLanguage: true,
                        isGroupchatConsultant: isEnabled(FeatureFlag.GroupChatV2),
                    }),
                    username: decodeUsername(singleData?.username || ''),
                    agencies: convertToOptions(singleData?.agencies || [], ['postcode', 'name', 'city'], 'id'),
                }}
                titleKey="agency.edit.general.general_information"
                onSave={onSave}
                editMode={!isEditing}
                hideCancelButton={!isEditing}
                hideSaveButton={!isEditing}
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
                    placeholder="plsSelect"
                    options={convertToOptions(
                        agenciesData?.data?.filter((agency) => agency.deleteDate === 'null') || [],
                        ['postcode', 'name', 'city'],
                        'id',
                    )}
                />

                <FormInputField
                    name="username"
                    labelKey="counselor.username"
                    placeholderKey="placeholder.username"
                    required
                    disabled={isEditing}
                />

                {typeOfUsers === 'consultants' && (
                    <>
                        <Space align="center">
                            <FormSwitchField labelKey="counselor.formalLanguage" name="formalLanguage" />
                            {isEditing && <FormSwitchField labelKey="counselor.absent" name="absent" />}
                            {isEnabled(FeatureFlag.GroupChatV2) && (
                                <FormSwitchField
                                    labelKey="counselor.isGroupChatConsultant"
                                    name="isGroupchatConsultant"
                                />
                            )}
                        </Space>
                        {isAbsentEnabled && (
                            <FormTextAreaField labelKey="counselor.absenceMessage" name="absenceMessage" />
                        )}
                    </>
                )}
            </CardEditable>

            {showReset2FAModal && (
                <Reset2FAModal
                    consultantId={id}
                    consultantName={`${singleData?.firstname} ${singleData?.lastname}`}
                    onClose={() => setShowReset2FAModal(false)}
                />
            )}
        </Page>
    );
};

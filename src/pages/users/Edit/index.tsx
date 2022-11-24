import { ChevronLeft } from '@mui/icons-material';
import { Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import { CardEditable } from '../../../components/Agency/AgencyEdit/components/CardEditable';
import { FormInputField } from '../../../components/FormInputField';
import { FormTextAreaField } from '../../../components/FormTextAreaField';
import { Page } from '../../../components/Page';
import { SelectFormField } from '../../../components/SelectFormField';
import { SwitchFormField } from '../../../components/SwitchFormField';
import { useAgenciesData } from '../../../hooks/useAgencysData';
import { useConsultantsData } from '../../../hooks/useConsultantsData';
import { convertToOptions } from '../../../utils/convertToOptions';

export const UserEditOrAdd = () => {
    const { t } = useTranslation();
    const { typeOfUsers, id } = useParams();
    const { data: consultantsResponse } = useConsultantsData({ search: id, pageSize: 1 });
    const { data: agenciesData, isLoading } = useAgenciesData({});
    const isEditing = id !== 'new';

    return (
        <Page>
            <div className="agencyEdit__headerBack">
                <NavLink to={`/admin/users/${typeOfUsers}`}>
                    <ChevronLeft />
                    <h3 className="agencyEdit__header--headline">{t('agency.add.general.headline')}</h3>
                </NavLink>
            </div>

            <CardEditable
                isLoading={isLoading}
                initialValues={{ ...(consultantsResponse?.data?.[0] || {}) }}
                titleKey="agency.edit.general.general_information"
                onSave={null}
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
                    name="agencyIds"
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
                {isEditing && <FormTextAreaField labelKey="counselor.absenceMessage" name="absenceMessage" required />}
            </CardEditable>
        </Page>
    );
};

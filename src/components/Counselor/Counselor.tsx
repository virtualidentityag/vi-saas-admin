import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Form, Input, message, FormInstance, Select, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useWatch } from 'antd/lib/form/Form';
import { LabeledValue } from 'antd/lib/select';
import { CounselorData } from '../../types/counselor';
import { decodeUsername } from '../../utils/encryptionHelpers';
import getAgencyByTenantData from '../../api/agency/getAgencyByTenantData';
import removeEmbedded from '../../utils/removeEmbedded';
import { AgencyData } from '../../types/agency';

const { Option } = Select;
const { TextArea } = Input;
const { Item } = Form;

export const defaultCounselor: CounselorData = {
    lastname: '',
    firstname: '',
    email: '',
    active: true,
    gender: '',
    id: '',
    phone: '',
    agencies: [],
    agencyIds: [],
    username: '',
    key: '',
    formalLanguage: true,
    absent: false,
    absenceMessage: '',
    status: 'null',
    twoFactorAuth: false,
};

export interface Props {
    formData: CounselorData;
    isInAddMode?: boolean;
    modalForm: FormInstance;
    handleEditCounselor?: (arg0: CounselorData) => void;
    setButtonDisabled: Dispatch<SetStateAction<boolean>>;
}

const Counselor = ({ formData, isInAddMode = false, modalForm, handleEditCounselor, setButtonDisabled }: Props) => {
    const { t } = useTranslation();

    const [checkAbsent, setCheckAbsent] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [allAgencies, setAllAgencies] = useState<Array<Partial<AgencyData>>>([]);
    const [editing, setEditing] = useState(isInAddMode);
    const agenciesSelected = (useWatch('agencies', modalForm) as LabeledValue[]) || [];

    const onAbsentChange = (value: boolean) => {
        setCheckAbsent(value);
    };

    useEffect(() => {
        modalForm.validateFields(['absenceMessage']);
    }, [checkAbsent, modalForm]);

    useEffect(() => {
        modalForm.resetFields();
    }, [formData, modalForm]);

    const {
        lastname,
        firstname,
        email,
        phone,
        active,
        agencies,
        agencyIds,
        username,
        id,
        formalLanguage,
        absent,
        absenceMessage,
    } = formData;

    const onFormSubmit = (values: any) => {
        setEditing(!editing);
        if (handleEditCounselor) {
            handleEditCounselor(values);
        }
    };

    const onFinishFailed = () => {
        message.error({
            content: t('message.error.default'),
            duration: 3,
        });
    };

    useEffect(() => {
        setIsLoading(true);
        getAgencyByTenantData()
            .then((result: any) => {
                // eslint-disable-next-line no-underscore-dangle
                const resultNormalized = removeEmbedded(result).data?.filter(
                    (agency: AgencyData) => agency.deleteDate === 'null',
                );
                modalForm.setFieldsValue({ agency: resultNormalized[0].id });
                setAllAgencies(resultNormalized);
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
                setAllAgencies([]);
            });
    }, [t, id, modalForm]);

    const sortAgenciesByPostcode = (agencyItemA: Record<string, any>, agencyItemB: Record<string, any>) => {
        if (agencyItemA.postcode > agencyItemB.postcode) return 1;
        if (agencyItemA.postcode < agencyItemB.postcode) return -1;
        return 0;
    };

    const convertToOption = (agency: Partial<AgencyData>) => ({
        label: `${agency.postcode} - ${agency.name} (${agency.city})`,
        value: `${agency.id}`,
    });

    const agenciesForSelect = allAgencies
        ?.filter((agency) => !agenciesSelected.find((a) => a.value === `${agency.id}`))
        ?.sort(sortAgenciesByPostcode)
        .map(convertToOption);

    return (
        <Spin spinning={isLoading}>
            <Form
                form={modalForm}
                onFinish={onFormSubmit}
                onFinishFailed={onFinishFailed}
                onFieldsChange={() => {
                    setButtonDisabled(
                        Object.values(
                            modalForm.getFieldsValue(['firstname', 'lastname', 'email', 'username', 'agencies']),
                        ).some((field: any) => field.length === 0) ||
                            modalForm.getFieldsError().some((field: any) => field.errors.length > 0),
                    );
                }}
                size="small"
                labelAlign="left"
                labelWrap
                layout="vertical"
                initialValues={{
                    firstname,
                    lastname,
                    agencyIds,
                    agencies: agencies.map(convertToOption),
                    phone,
                    email,
                    username: decodeUsername(username),
                    id,
                    formalLanguage,
                    absent,
                    absenceMessage,
                }}
            >
                <div className={clsx('counselor', !active && 'inactive')}>
                    <Item label={t('firstname')} name="firstname" rules={[{ required: true }]}>
                        <Input placeholder={t('placeholder.firstname')} />
                    </Item>

                    <Item label={t('lastname')} name="lastname" rules={[{ required: true }]}>
                        <Input placeholder={t('placeholder.lastname')} />
                    </Item>

                    <Item name="id" hidden>
                        <Input hidden />
                    </Item>
                    <Item
                        label={t('email')}
                        name="email"
                        rules={[
                            {
                                required: true,
                                type: 'email',
                                message: t('message.error.email.incorrect'),
                            },
                        ]}
                    >
                        <Input placeholder={t('placeholder.email')} />
                    </Item>

                    <Item
                        label={t('agency')}
                        name="agencies"
                        className="agency-select-container"
                        rules={[{ required: true, type: 'array' }]}
                    >
                        <Select
                            mode="multiple"
                            className="agencies-select"
                            disabled={isLoading}
                            labelInValue
                            getPopupContainer={(element: HTMLElement) => element.parentElement}
                            allowClear
                            filterOption={(input, option) =>
                                option?.label.toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) !== -1
                            }
                            placeholder={t('plsSelect')}
                            options={agenciesForSelect}
                        />
                    </Item>
                    <Item label={t('counselor.username')} name="username" rules={[{ required: true }]}>
                        <Input placeholder={t('placeholder.username')} disabled={!isInAddMode} />
                    </Item>

                    <Item
                        label={t('counselor.formalLanguage')}
                        name="formalLanguage"
                        rules={[{ required: true }]}
                        className="formal-language"
                    >
                        <Select placeholder={t('plsSelect')}>
                            <Option key={0} value>
                                {t('yes')}
                            </Option>
                            <Option key={1} value={false}>
                                {t('no')}
                            </Option>
                        </Select>
                    </Item>
                    {!isInAddMode ? (
                        <>
                            <Item label={t('counselor.absent')} name="absent" rules={[{ required: true }]}>
                                <Select placeholder={t('plsSelect')} onChange={onAbsentChange}>
                                    <Option key={0} value>
                                        {t('yes')}
                                    </Option>
                                    <Option key={1} value={false}>
                                        {t('no')}
                                    </Option>
                                </Select>
                            </Item>

                            <Item
                                label={t('counselor.absenceMessage')}
                                name="absenceMessage"
                                rules={[{ required: checkAbsent }]}
                            >
                                <TextArea rows={3} />
                            </Item>
                        </>
                    ) : (
                        <Item name="absent" hidden>
                            <Input hidden />
                        </Item>
                    )}
                </div>
            </Form>
        </Spin>
    );
};

export default Counselor;

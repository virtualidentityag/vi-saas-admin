import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Form, Input, message, FormInstance, Select, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { BasicTenantData, TenantData } from '../../types/tenant';

const { Option } = Select;
const { Item } = Form;

export const defaultTenant: BasicTenantData = {
    id: null,
    name: '',
    subdomain: '',
    createDate: '',
    isSuperAdmin: false,
    userRoles: [],
    licensing: { allowedNumberOfUsers: 0, videoFeature: false },
    settings: {},
    consultingType: 'beratung',
    twoFactorAuth: false,
    formalLanguage: false,
    startServiceDate: '',
};

export interface Props {
    formData: BasicTenantData;
    isInAddMode?: boolean;
    modalForm: FormInstance;
    handleEditTenant?: (arg0: BasicTenantData) => void;
    setButtonDisabled: Dispatch<SetStateAction<boolean>>;
}

const Tenant = ({ formData, isInAddMode = false, modalForm, handleEditTenant, setButtonDisabled }: Props) => {
    const { t } = useTranslation();

    const [editing, setEditing] = useState(isInAddMode);

    useEffect(() => {
        modalForm.resetFields();
    }, [formData, modalForm]);

    const { id, name, subdomain, createDate, licensing, settings, consultingType, formalLanguage, startServiceDate } =
        formData;

    const onFormSubmit = (values: TenantData) => {
        setEditing(!editing);

        handleEditTenant?.(values);
    };

    const onFinishFailed = () => {
        message.error({
            content: t('message.error.default'),
            duration: 3,
        });
    };

    return (
        <Spin spinning={false}>
            <Form
                form={modalForm}
                onFinish={onFormSubmit}
                onFinishFailed={onFinishFailed}
                onFieldsChange={() => {
                    setButtonDisabled(
                        Object.values(modalForm.getFieldsValue(['name', 'subdomain', 'allowedNumberOfUsers'])).some(
                            (field: any) => field?.length === 0,
                        ) || modalForm.getFieldsError().some((field: any) => field.errors.length > 0),
                    );
                }}
                size="small"
                labelAlign="left"
                labelWrap
                layout="vertical"
                initialValues={{
                    name,
                    subdomain,
                    id,
                    createDate,
                    licensing,
                    settings,
                    consultingType,
                    formalLanguage,
                    startServiceDate,
                }}
            >
                <div className={clsx('tenant')}>
                    <Item label={t('organisation.name')} name="name" rules={[{ required: true }]}>
                        <Input placeholder={t('placeholder.name')} />
                    </Item>

                    <Item label={t('organisation.subdomain')} name="subdomain" rules={[{ required: true }]}>
                        <Input placeholder={t('placeholder.subdomain')} />
                    </Item>

                    {/* add startServiceDate date selector field */}

                    <Item name="id" hidden>
                        <Input hidden />
                    </Item>

                    <Item label={t('organisation.consultingType')} name="consultingType" rules={[{ required: false }]}>
                        <Input placeholder={t('placeholder.consultingType')} />
                    </Item>

                    <Item
                        label={t('organisation.allowedNumberOfUsers')}
                        name="allowedNumberOfUsers"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder={t('placeholder.allowedNumberOfUsers')} />
                    </Item>

                    <Item label={t('organisation.videoFeature')} name="videoFeature" rules={[{ required: false }]}>
                        <Select placeholder={t('plsSelect')}>
                            <Option key={0} value>
                                {t('yes')}
                            </Option>
                            <Option key={1} value={false}>
                                {t('no')}
                            </Option>
                        </Select>
                    </Item>

                    <Item label={t('organisation.formalLanguage')} name="formalLanguage" rules={[{ required: false }]}>
                        <Select placeholder={t('plsSelect')}>
                            <Option key={0} value>
                                {t('yes')}
                            </Option>
                            <Option key={1} value={false}>
                                {t('no')}
                            </Option>
                        </Select>
                    </Item>
                </div>
            </Form>
        </Spin>
    );
};

export default Tenant;

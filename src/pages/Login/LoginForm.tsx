import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import routePathNames from '../../appConfig';
import { FETCH_ERRORS } from '../../api/fetchData';
import { useLoginMutation } from '../../hooks/useLoginMutation.hook';
import { TwoFactorType } from '../../enums/TwoFactorType';
import { usePublicTenantData } from '../../hooks/usePublicTenantData.hook';

const LoginForm = () => {
    const { data: tenantData } = usePublicTenantData();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { mutate: login } = useLoginMutation(tenantData?.id);
    const [postLoading, setPostLoading] = useState(false);
    const [otpDisabled, setOtpDisabled] = useState(true);
    const [twoFactorType, setTwoFactorType] = useState(TwoFactorType.None);

    const onFinish = async (values: { username: string; password: string; otp: string }) => {
        setPostLoading(true);

        login(values, {
            onSuccess: () => {
                setPostLoading(false);
                navigate('/admin');
            },
            onError: (error) => {
                if (error.message === FETCH_ERRORS.BAD_REQUEST) {
                    setOtpDisabled(false);
                    setTwoFactorType(error.options.data.otpType);
                } else {
                    message.error(t('message.error.auth.login'));
                }
                setPostLoading(false);
            },
        });
    };

    return (
        <Form
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            size="large"
            style={{ maxWidth: 360, margin: '0 auto' }}
        >
            <Form.Item
                name="username"
                rules={[{ required: true, message: t('message.form.login.username') }]}
            >
                <Input prefix={<UserOutlined />} placeholder={t('username.or.email')} />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[{ required: true, message: t('message.form.login.password') }]}
            >
                <Input.Password prefix={<LockOutlined />} placeholder={t('password')} />
            </Form.Item>

            {!otpDisabled && (
                <Form.Item
                    name="otp"
                    rules={[{ required: true, message: t('message.form.login.otp') }]}
                    extra={t(`message.form.login.otp.${twoFactorType}`)}
                >
                    <Input prefix={<SafetyOutlined />} placeholder={t('otp')} />
                </Form.Item>
            )}

            <Form.Item>
                <a href={routePathNames.loginResetPasswordLink}>{t('password.forgot')}</a>
            </Form.Item>

            <Form.Item shouldUpdate>
                {({ getFieldsValue }) => {
                    const { username, password } = getFieldsValue();
                    const formIsComplete = !!username && !!password;
                    return (
                        <Button
                            block
                            type="primary"
                            htmlType="submit"
                            loading={postLoading}
                            disabled={!formIsComplete}
                        >
                            {t('message.form.login.loginBtn')}
                        </Button>
                    );
                }}
            </Form.Item>
        </Form>
    );
};

export default LoginForm;

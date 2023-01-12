import { Button, Col, Form, Row } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { WarningTwoTone } from '@ant-design/icons';
import { FormInputField } from '../../../components/FormInputField';
import { Page } from '../../../components/Page';
import routePathNames from '../../../appConfig';
import { Card } from '../../../components/Card';
import { useAppConfigContext } from '../../../context/useAppConfig';
import { FormInputNumberField } from '../../../components/FormInputNumberField';
import styles from './styles.module.scss';
import { useAddOrUpdateTenant } from '../../../hooks/useAddOrUpdateTenant.hook';
import { useTenantFor } from '../../../hooks/useTenantFor';

export const TenantEditOrAdd = () => {
    const navigate = useNavigate();
    const [form] = useForm();
    const { settings } = useAppConfigContext();
    const { t } = useTranslation();
    const { id, main } = useParams<{ id: string; main?: string }>();
    const isEditing = id !== 'add';
    const { data, isLoading } = useTenantFor({ id, enabled: isEditing });
    const { mutate: update } = useAddOrUpdateTenant({ id: id !== 'add' ? id : null });

    // Removes the main subdomain
    const mainDomain = window.location.host.replace(
        new RegExp(`^${settings.mainTenantSubdomainForSingleDomainMultitenancy}.`, 'i'),
        '',
    );

    return (
        <Page isLoading={isLoading}>
            <Form
                size="large"
                labelAlign="left"
                labelWrap
                layout="vertical"
                form={form}
                onFinish={update}
                initialValues={{ ...data }}
            >
                <Page.BackWithActions
                    path={routePathNames.tenants}
                    titleKey={main ? 'tenants.edit.mainTenant.headline' : 'tenants.edit.headline'}
                >
                    <Button type="default" onClick={() => navigate(routePathNames.tenants)}>
                        {t('tenants.edit.cancel')}
                    </Button>
                    <Button type="primary" onClick={() => form.submit()}>
                        {t('tenants.edit.save')}
                    </Button>
                </Page.BackWithActions>

                <Row gutter={[24, 24]}>
                    <Col span={24} md={12} lg={6}>
                        <Card titleKey="tenants.add.mainTenantTitle">
                            <div className={styles.fieldGroup}>
                                <div className={styles.description}>{t('tenants.add.form.name.label')}</div>
                                <FormInputField
                                    name="name"
                                    placeholderKey="tenants.add.form.name.placeholder"
                                    required
                                />
                            </div>
                            <div className={styles.fieldGroup}>
                                <div className={styles.description}>{t('tenants.add.form.subdomain.label')}</div>
                                <div className={styles.warning}>
                                    <WarningTwoTone twoToneColor="#FF9F00" />
                                    {t('tenants.add.form.subdomain.warning')}
                                </div>

                                <FormInputField
                                    name="subdomain"
                                    placeholderKey="tenants.add.form.subdomain.placeholder"
                                    required
                                    addonAfter={mainDomain}
                                />
                            </div>
                            <div className={styles.fieldGroup}>
                                <div className={styles.description}>
                                    {t('tenants.add.form.allowedConsultantsLicense.label')}
                                </div>
                                <FormInputNumberField
                                    name={['licensing', 'allowedNumberOfUsers']}
                                    placeholderKey="tenants.add.form.allowedConsultantsLicense.placeholder"
                                    required
                                    min={0}
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </Page>
    );
};

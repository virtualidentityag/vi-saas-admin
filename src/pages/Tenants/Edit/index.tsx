import { Button, Col, Form, Row } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { useState } from 'react';
import { FormInputField } from '../../../components/FormInputField';
import { Page } from '../../../components/Page';
import { ModalSuccess } from '../../../components/ModalSuccess';
import routePathNames from '../../../appConfig';
import { Card } from '../../../components/Card';
import { useAppConfigContext } from '../../../context/useAppConfig';
import { FormInputNumberField } from '../../../components/FormInputNumberField';
import styles from './styles.module.scss';
import { useAddOrUpdateTenant } from '../../../hooks/useAddOrUpdateTenant.hook';
import { useTenantFor } from '../../../hooks/useTenantFor';
import { SelectFormField } from '../../../components/SelectFormField';

export const TenantEditOrAdd = () => {
    const { id, main } = useParams<{ id: string; main?: string }>();
    const isEditing = id !== 'add';
    const [isReadOnly, setReadOnly] = useState(isEditing);
    const navigate = useNavigate();
    const [newTenantId, setNewTenantId] = useState<number>(null);
    const [form] = useForm();
    const { settings } = useAppConfigContext();
    const { t } = useTranslation();
    const { data, isLoading } = useTenantFor({ id, enabled: isEditing });
    const { mutate: update } = useAddOrUpdateTenant({
        id: id !== 'add' ? id : null,
        onSuccess: (rData) => {
            if (!isEditing) {
                setNewTenantId(rData.id);
            }
        },
    });

    const isMainTenant = !!main || settings.mainTenantSubdomainForSingleDomainMultitenancy === data?.subdomain;
    // Removes the main subdomain
    const mainDomain = window.location.host.replace(
        new RegExp(`^${settings.mainTenantSubdomainForSingleDomainMultitenancy}.`, 'i'),
        '',
    );

    return (
        <Page isLoading={isLoading}>
            {newTenantId && (
                <ModalSuccess
                    titleKey="tenants.created.modal.title"
                    onClose={() => navigate(routePathNames.tenants)}
                    contentKey="tenants.created.modal.description"
                    footer={
                        <Button
                            type="primary"
                            onClick={() => navigate(`${routePathNames.tenantAdmins}/add?tenantId=${newTenantId}`)}
                        >
                            {t('tenants.created.modal.link')}
                        </Button>
                    }
                />
            )}
            <Page.BackWithActions
                path={routePathNames.tenants}
                titleKey={main ? 'tenants.edit.mainTenant.headline' : 'tenants.edit.headline'}
            >
                {isReadOnly && (
                    <Button type="primary" onClick={() => setReadOnly(false)}>
                        {t('edit')}
                    </Button>
                )}
                {!isReadOnly && (
                    <>
                        <Button
                            type="default"
                            onClick={() => (isEditing ? setReadOnly(true) : navigate(routePathNames.tenants))}
                        >
                            {t('cancel')}
                        </Button>
                        <Button type="primary" onClick={() => form.submit()}>
                            {t('save')}
                        </Button>
                    </>
                )}
            </Page.BackWithActions>
            <Form
                disabled={isReadOnly}
                size="large"
                labelAlign="left"
                labelWrap
                layout="vertical"
                form={form}
                onFinish={update}
                initialValues={{ ...data }}
            >
                <Row gutter={[24, 24]}>
                    <Col span={12} md={6}>
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
                                {isMainTenant && (
                                    <div className={styles.warning}>{t('tenants.add.form.subdomain.warning')}</div>
                                )}

                                <FormInputField
                                    name="subdomain"
                                    placeholderKey="tenants.add.form.subdomain.placeholder"
                                    required
                                    addonAfter={mainDomain}
                                    disabled={isReadOnly || isMainTenant}
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
                    {isEditing && (
                        <Col span={12} md={6}>
                            <Card
                                titleKey="tenants.edit.adminEmailsCardTitle"
                                tooltip={t('tenants.edit.adminEmailsCardTooltip')}
                            >
                                {data?.adminEmails?.length && <SelectFormField name="adminEmails" required disabled />}
                                {!data?.adminEmails?.length && (
                                    <div className={styles.emptyAdminsContainer}>
                                        <PersonSearchIcon className={styles.emptyAdminsIcon} />

                                        <div className={styles.emptyAdminsText}>
                                            {t('tenants.edit.adminEmailsCardEmpty')}
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </Col>
                    )}
                </Row>
            </Form>
        </Page>
    );
};

import { PlusOutlined } from '@ant-design/icons';
import { Button, notification, Tag } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import routePathNames from '../../../appConfig';
import { CopyToClipboard } from '../../../components/CopyToClipboard';
import { EditButtons } from '../../../components/EditableTable/EditButtons';
import { Modal } from '../../../components/Modal';
import { Page } from '../../../components/Page';
import { ResizeTable } from '../../../components/ResizableTable';
import { SearchInput } from '../../../components/SearchInput/SearchInput';
import { useAppConfigContext } from '../../../context/useAppConfig';
import { PermissionAction } from '../../../enums/PermissionAction';
import { Resource } from '../../../enums/Resource';
import { useDeleteTenant } from '../../../hooks/useDeleteTenant';
import { useTenantsData } from '../../../hooks/useTenantsData';
import { useUserPermissions } from '../../../hooks/useUserPermission';
import { TenantData } from '../../../types/tenant';
import styles from './styles.module.scss';

export const TenantsList = () => {
    const navigate = useNavigate();
    const { page } = useParams();
    const { t } = useTranslation();

    const { settings } = useAppConfigContext();
    const [search, setSearch] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState<number>(null);
    const { can } = useUserPermissions();

    const { data, isLoading } = useTenantsData({ page: Number(page || 1), search });
    const { mutate: deleteTenant } = useDeleteTenant({
        onSuccess: () => {
            notification.success({ message: t('tenants.list.deleteMessage.success') });
        },
        onError: () => {
            notification.error({
                closeIcon: null,
                duration: 10,
                description: t('tenants.list.deleteMessage.error.description'),
                message: t('tenants.list.deleteMessage.error.title'),
            });
        },
    });

    const onDelete = useCallback((id) => {
        setShowDeleteModal(null);
        deleteTenant(id);
    }, []);

    // Removes the main subdomain
    const mainDomain = window.location.host.replace(
        new RegExp(`^${settings.mainTenantSubdomainForSingleDomainMultitenancy}.`, 'i'),
        '',
    );

    const columnsData = [
        {
            title: t('tenants.list.name'),
            dataIndex: 'name',
            width: 120,
            ellipsis: true,
            render: (name: string, record: TenantData) => (
                <>
                    {name}
                    {settings.mainTenantSubdomainForSingleDomainMultitenancy === record.subdomain && (
                        <Tag className={styles.mainTenant}>{t('tenants.list.mainTenantTag')}</Tag>
                    )}
                </>
            ),
        },
        {
            title: t('tenants.list.adminEmails'),
            dataIndex: 'adminEmails',
            width: 150,
            ellipsis: true,
            render: (emails: string[]) => (
                <div className={styles.emailsContainer}>
                    {emails?.map((email) => (
                        <CopyToClipboard className={styles.email} key={email}>
                            {email}
                        </CopyToClipboard>
                    ))}
                </div>
            ),
        },
        {
            width: 150,
            title: t('tenants.list.subdomain'),
            dataIndex: 'subdomain',
            ellipsis: true,
            render: (subdomain: string) => (
                <Link
                    target="_blank"
                    to={`//${subdomain}.${mainDomain}`}
                    className={styles.subdomain}
                >{`${subdomain}.${mainDomain}`}</Link>
            ),
        },
        {
            width: 100,
            title: t('tenants.list.tenantId'),
            dataIndex: 'id',
            ellipsis: true,
        },
        {
            width: 80,
            title: t('tenants.list.consultantsCount'),
            ellipsis: true,
        },
        can([PermissionAction.Update, PermissionAction.Delete], Resource.Tenant) && {
            width: 80,
            title: '',
            key: 'edit',
            render: (_: unknown, record: TenantData) => {
                return (
                    <div className="tableActionWrapper">
                        <EditButtons
                            handleEdit={() => navigate(`${routePathNames.tenants}/${record.id}`)}
                            handleDelete={() => setShowDeleteModal(record.id)}
                            record={record}
                            disabled={{
                                edit: false,
                                delete: settings.mainTenantSubdomainForSingleDomainMultitenancy === record.subdomain,
                            }}
                            resource={Resource.Tenant}
                        />
                    </div>
                );
            },
            className: 'counselorList__column',
            fixed: 'right',
        },
    ].filter(Boolean) as Array<ColumnProps<TenantData>>;

    return (
        <Page>
            <Page.Title titleKey="tenants.title" subTitle={t('tenants.subTitle', { count: data?.length || 0 })}>
                <div className={styles.searchContainer}>
                    <SearchInput
                        placeholder={t('tenants.searchPlaceholder')}
                        handleOnSearch={(a) => setSearch(a)}
                        handleOnSearchClear={() => setSearch('')}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate(`${routePathNames.tenants}/add`)}
                    >
                        {t('tenants.list.new')}
                    </Button>
                </div>
            </Page.Title>

            <ResizeTable
                loading={isLoading}
                columns={columnsData}
                dataSource={data}
                rowKey="id"
                locale={{ emptyText: t('tenants.list.empty') }}
            />

            {showDeleteModal !== null && (
                <Modal
                    titleKey="tenants.list.deleteModal.title"
                    contentKey="tenants.list.deleteModal.description"
                    cancelLabelKey="tenants.list.deleteModal.confirm"
                    onClose={() => setShowDeleteModal(null)}
                    footer={
                        <>
                            <Button key="confirm" onClick={() => onDelete(showDeleteModal)}>
                                {t('tenants.list.deleteModal.confirm')}
                            </Button>
                            <Button key="cancel" type="primary" onClick={() => setShowDeleteModal(null)}>
                                {t('tenants.list.deleteModal.cancel')}
                            </Button>
                        </>
                    }
                />
            )}
        </Page>
    );
};

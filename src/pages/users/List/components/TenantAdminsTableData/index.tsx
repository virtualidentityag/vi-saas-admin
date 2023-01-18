import { ColumnProps, TablePaginationConfig } from 'antd/lib/table';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useDebouncedCallback } from 'use-debounce';
import { Col, Row } from 'antd';
import AddButton from '../../../../../components/EditableTable/AddButton';
import EditButtons from '../../../../../components/EditableTable/EditButtons';
import SearchInput from '../../../../../components/SearchInput/SearchInput';
import { CounselorData } from '../../../../../types/counselor';
import { ResizeTable } from '../../../../../components/ResizableTable';
import { DEFAULT_ORDER, DEFAULT_SORT } from '../../../../../api/counselor/getCounselorSearchData';
import { useUserPermissions } from '../../../../../hooks/useUserPermission';
import { Resource } from '../../../../../enums/Resource';
import { PermissionAction } from '../../../../../enums/PermissionAction';
import { useTenantAdminsData } from '../../../../../hooks/useTenantUserAdminsData';
import { useAppConfigContext } from '../../../../../context/useAppConfig';
import { DeleteTenantAdminModal } from '../DeleteTenantAdmin';
import { getDomainWithoutMainTenant } from '../../../../../utils/getDomain';
import styles from './styles.module.scss';

export const TenantsTableData = () => {
    const { settings } = useAppConfigContext();
    const { can } = useUserPermissions();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [deleteUserId, setDeleteUserId] = useState<string>(null);
    const [search, setSearch] = useState('');

    const [tableState, setTableState] = useState<TableState>({
        current: 1,
        sortBy: DEFAULT_SORT,
        order: DEFAULT_ORDER,
        pageSize: 10,
    });
    const {
        data: responseList,
        isLoading,
        refetch,
    } = useTenantAdminsData({
        search,
        ...tableState,
    });

    // Removes the main subdomain
    const mainDomain = getDomainWithoutMainTenant(settings.mainTenantSubdomainForSingleDomainMultitenancy);
    const setSearchDebounced = useDebouncedCallback(setSearch, 100);

    const onClose = useCallback(() => {
        setDeleteUserId(null);
        refetch();
    }, []);

    const handleTableAction = useCallback((pagination: TablePaginationConfig, _: any, sorter: any) => {
        const { current, pageSize } = pagination;
        if (sorter.field) {
            const sortBy = sorter.field.toUpperCase();
            const order = sorter.order === 'descend' ? 'DESC' : 'ASC';
            setTableState({
                ...tableState,
                current,
                pageSize,
                sortBy,
                order,
            });
        } else {
            setTableState({ ...tableState, current, pageSize });
        }
    }, []);

    const columnsData = [
        {
            title: t('firstname'),
            dataIndex: 'firstname',
            width: 120,
            ellipsis: true,
            fixed: 'left',
        },
        {
            title: t('lastname'),
            dataIndex: 'lastname',
            width: 130,
            ellipsis: true,
            fixed: 'left',
        },
        {
            width: 150,
            title: t('tenantAdmins.list.email'),
            dataIndex: 'email',
            ellipsis: true,
        },
        {
            width: 200,
            title: t('tenantAdmins.form.subdomain'),
            dataIndex: 'tenantSubdomain',
            ellipsis: true,
            render: (subdomain: string) => `${subdomain}.${mainDomain}`,
        },
        {
            width: 100,
            title: t('tenantAdmins.form.domainId'),
            dataIndex: 'tenantId',
            ellipsis: true,
        },
        can([PermissionAction.Update, PermissionAction.Delete], Resource.TenantAdminUser) && {
            width: 80,
            title: '',
            render: (_: unknown, record: CounselorData) => {
                return (
                    <div className="tableActionWrapper">
                        <EditButtons
                            handleEdit={() => navigate(`/admin/users/tenant-admins/${record.id}`)}
                            handleDelete={() => setDeleteUserId(record.id)}
                            record={record}
                            resource={Resource.TenantAdminUser}
                        />
                    </div>
                );
            },
            fixed: 'right',
        },
    ] as Array<ColumnProps<CounselorData>>;

    const pagination = {
        total: responseList?.total,
        current: tableState.current,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30'],
    };

    return (
        <div>
            <Row gutter={[20, 10]}>
                <Col offset={6} span={6} className={styles.searchNewContainer}>
                    <SearchInput
                        placeholder={t('consultant-search-placeholder')}
                        handleOnSearch={setSearchDebounced}
                        handleOnSearchClear={() => setSearch('')}
                    />
                    {can(PermissionAction.Create, Resource.TenantAdminUser) && (
                        <AddButton
                            allowedNumberOfUsers={false}
                            sourceLength={responseList?.total}
                            handleBtnAdd={() => navigate(`/admin/users/tenant-admins/add`)}
                        />
                    )}
                </Col>
            </Row>
            <ResizeTable
                rowKey="id"
                loading={isLoading}
                columns={columnsData}
                dataSource={responseList?.data || []}
                pagination={pagination}
                onChange={handleTableAction}
            />
            {deleteUserId && can(PermissionAction.Delete, Resource.TenantAdminUser) && (
                <DeleteTenantAdminModal id={deleteUserId} onClose={onClose} />
            )}
        </div>
    );
};

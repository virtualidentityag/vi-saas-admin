import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal, Space, Switch, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/lib/table';
import { InterestsOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import getTopicData from '../../../api/topic/getTopicData';
import { TopicData } from '../../../types/topic';
import { Status } from '../../../types/status';
import { TopicDeletionModal } from './TopicDeletionModal';
import { useAppConfigContext } from '../../../context/useAppConfig';
import { useUserRoles } from '../../../hooks/useUserRoles.hook';
import { useFeatureContext } from '../../../context/FeatureContext';
import { FeatureFlag } from '../../../enums/FeatureFlag';
import { UserRole } from '../../../enums/UserRole';
import { Resource } from '../../../enums/Resource';
import { useUserPermissions } from '../../../hooks/useUserPermission';
import { PermissionAction } from '../../../enums/PermissionAction';
import routePathNames from '../../../appConfig';
import { useTenantAdminDataMutation } from '../../../hooks/useTenantAdminDataMutation.hook';
import StatusIcons from '../../../components/EditableTable/StatusIcons';
import EditButtons from '../../../components/EditableTable/EditButtons';
import { Page } from '../../../components/Page';
import { useTenantData } from '../../../hooks/useTenantData.hook';

export const TopicList = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { can } = useUserPermissions();
    const { data } = useTenantData();
    const { settings } = useAppConfigContext();
    const { isEnabled, toggleFeature } = useFeatureContext();
    const { hasRole } = useUserRoles();
    const { mutate: updateTenantData } = useTenantAdminDataMutation({ id: `${data.id}` });
    const [topicIdForDelete, setTopicIdForDelete] = useState<number>(null);
    const [topics, setTopics] = useState([]);
    const [numberOfTopics, setNumberOfTopics] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [tableState, setTableState] = useState<TableState>({
        current: 1,
        sortBy: undefined,
        order: undefined,
    });

    const isTopicsFeatureActive = isEnabled(FeatureFlag.TopicsInRegistration);
    const onTopicsSwitch = useCallback(() => {
        Modal.confirm({
            title: t(isTopicsFeatureActive ? 'topics.featureToggle.off.title' : 'topics.featureToggle.on.title'),
            content: t(
                isTopicsFeatureActive ? 'topics.featureToggle.off.description' : 'topics.featureToggle.on.description',
            ),
            width: '768px',
            icon: <InterestsOutlined />,
            onOk() {
                updateTenantData(
                    {
                        settings: {
                            topicsInRegistrationEnabled: !isTopicsFeatureActive,
                        },
                    },
                    {
                        onSuccess: () => toggleFeature(FeatureFlag.TopicsInRegistration),
                    },
                );
            },
        });
    }, [isTopicsFeatureActive]);

    const reloadTopicList = () => {
        setIsLoading(true);
        getTopicData(tableState).then((result) => {
            setTopics(result.data);
            setNumberOfTopics(result.total);
            setIsLoading(false);
        });
    };

    const onCloseDeleteModal = useCallback(() => {
        setTopicIdForDelete(null);
        reloadTopicList();
    }, []);

    function defineTableColumns(): ColumnsType<TopicData> {
        return [
            {
                title: t('topic.name'),
                dataIndex: 'name',
                key: 'name',
                sorter: (a, b) => a.name.localeCompare(b.name),
                width: 150,
                ellipsis: true,
                fixed: 'left',
                className: 'topicList__column',
            },
            {
                title: t('topic.description'),
                dataIndex: 'description',
                key: 'description',
                sorter: (a, b) => a.description.localeCompare(b.description),
                width: 350,
                ellipsis: true,
                className: 'topicList__column',
            },
            {
                title: t('topic.internalIdentifier'),
                dataIndex: 'internalIdentifier',
                key: 'internalIdentifier',
                sorter: (a, b) => (a.internalIdentifier || 'a').localeCompare(b.internalIdentifier || 'b'),
                width: 150,
                ellipsis: true,
            },
            {
                width: 80,
                title: t('status'),
                dataIndex: 'status',
                key: 'status',
                sorter: (a, b) => (a.status > b.status ? 1 : -1),
                ellipsis: true,
                render: (status: Status) => {
                    return <StatusIcons status={status} />;
                },
            },
            {
                width: 88,
                title: '',
                key: 'edit',
                render: (_: any, record: TopicData) => {
                    return (
                        <div className="tableActionWrapper">
                            <EditButtons
                                isDisabled={record.status === 'IN_DELETION'}
                                handleEdit={() => navigate(`/admin/topics/${record.id}`)}
                                handleDelete={() => setTopicIdForDelete(record.id)}
                                record={record}
                                hide={['delete']}
                                resource={Resource.Topic}
                            />
                        </div>
                    );
                },
                fixed: 'right',
            },
        ];
    }

    useEffect(() => {
        reloadTopicList();
    }, [tableState]);

    const tableChangeHandler = (pagination: any, filters: any, sorter: any) => {
        if (sorter.field) {
            const sortBy = sorter.field.toUpperCase();
            const order = sorter.order === 'descend' ? 'DESC' : 'ASC';
            setTableState({
                ...tableState,
                current: pagination.current,
                sortBy,
                order,
            });
        } else {
            setTableState({ ...tableState, current: pagination.current });
        }
    };

    const pagination = {
        total: numberOfTopics,
        current: tableState.current,
        defaultPageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30'],
    };

    // When we've the multi tenancy in single tenant mode we can only show if we've the tenant admin role
    const canShowTopicSwitch =
        ((settings.multitenancyWithSingleDomainEnabled && hasRole(UserRole.TenantAdmin)) ||
            !settings.multitenancyWithSingleDomainEnabled) &&
        can(PermissionAction.Create, Resource.Topic) &&
        isEnabled(FeatureFlag.Topics);

    return (
        <Page isLoading={isLoading}>
            <Page.Title titleKey="topics.title" subTitleKey="topics.title.text" />

            <Space align="baseline">
                {can(PermissionAction.Create, Resource.Topic) && (
                    <Button
                        className="mb-m mr-sm"
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate(`${routePathNames.topics}/add`)}
                    >
                        {t('new')}
                    </Button>
                )}

                {canShowTopicSwitch && (
                    <>
                        <Switch checked={isTopicsFeatureActive} onClick={onTopicsSwitch} />
                        {t('topics.featureToggle')}
                    </>
                )}
            </Space>

            <Table
                loading={isLoading}
                className="topicList editableTable"
                dataSource={topics}
                columns={defineTableColumns()}
                scroll={{
                    x: 'max-content',
                    y: 'auto',
                }}
                sticky
                tableLayout="fixed"
                onChange={tableChangeHandler}
                pagination={pagination}
                rowKey="id"
            />

            {topicIdForDelete && <TopicDeletionModal id={topicIdForDelete} onClose={onCloseDeleteModal} />}
        </Page>
    );
};

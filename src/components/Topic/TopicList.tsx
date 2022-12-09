import React, { useCallback, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import Title from 'antd/es/typography/Title';
import { Button, Modal, Space, Switch, Table } from 'antd';

import { PlusOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/lib/table';
import { isDisabled } from '@testing-library/user-event/dist/utils';
import { InterestsOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import getTopicData from '../../api/topic/getTopicData';
import { TopicData } from '../../types/topic';
import { Status } from '../../types/status';
import StatusIcons from '../EditableTable/StatusIcons';
import { TopicDeletionModal } from './TopicDeletionModal';
import EditButtons from '../EditableTable/EditButtons';
import { useAppConfigContext } from '../../context/useAppConfig';
import { useUserRoles } from '../../hooks/useUserRoles.hook';
import { useFeatureContext } from '../../context/FeatureContext';
import { FeatureFlag } from '../../enums/FeatureFlag';
import { useTenantData } from '../../hooks/useTenantData.hook';
import { useTenantDataUpdate } from '../../hooks/useTenantDataUpdate.hook';
import { UserRole } from '../../enums/UserRole';
import { Resource } from '../../enums/Resource';
import { useUserPermissions } from '../../hooks/useUserPermission';
import { PermissionAction } from '../../enums/PermissionAction';
import routePathNames from '../../appConfig';

export const TopicList = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { can } = useUserPermissions();
    const { settings } = useAppConfigContext();
    const { isEnabled, toggleFeature } = useFeatureContext();
    const [, hasRole] = useUserRoles();
    const { data: tenantData } = useTenantData();
    const { mutate: updateTenantData } = useTenantDataUpdate();
    const [topics, setTopics] = useState([]);
    const [numberOfTopics, setNumberOfTopics] = useState(0);
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
                        ...tenantData,
                        settings: {
                            ...tenantData.settings,
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

    const [isLoading, setIsLoading] = useState(true);

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
                                handleDelete={isDisabled}
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

    const reloadTopicList = () => {
        setIsLoading(true);
        getTopicData(tableState).then((result) => {
            setTopics(result.data);
            setNumberOfTopics(result.total);
            setIsLoading(false);
        });
    };

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
        <>
            <Title level={3}>{t('topics.title')}</Title>
            <p>{t('topics.title.text')}</p>

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
                    y: '100%',
                }}
                sticky
                tableLayout="fixed"
                onChange={tableChangeHandler}
                pagination={pagination}
                rowKey="id"
                style={{
                    width: '100%',
                }}
            />

            <TopicDeletionModal />
        </>
    );
};

import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Space, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/lib/table';
import { useNavigate } from 'react-router-dom';
import EditButtons from '../../components/EditableTable/EditButtons';
import getAgencyData from '../../api/agency/getAgencyData';
import { AgencyData } from '../../types/agency';
import { Status } from '../../types/status';
import StatusIcons from '../../components/EditableTable/StatusIcons';
import pubsub, { PubSubEvents } from '../../state/pubsub/PubSub';
import { AgencyDeletionModal } from './AgencyDeletionModal';
import ResizableTitle from '../../components/Resizable/Resizable';
import { useFeatureContext } from '../../context/FeatureContext';
import { TopicData } from '../../types/topic';
import routePathNames from '../../appConfig';
import { FeatureFlag } from '../../enums/FeatureFlag';
import { useUserPermissions } from '../../hooks/useUserPermission';
import { PermissionAction } from '../../enums/PermissionAction';
import { Resource } from '../../enums/Resource';
import { Page } from '../../components/Page';

const emptyAgencyModel: AgencyData = {
    id: null,
    name: '',
    city: '',
    topics: [],
    topicIds: [],
    consultingType: '',
    description: '',
    offline: true,
    online: false,
    postcode: '',
    teamAgency: true,
    status: undefined,
    deleteDate: undefined,
};

let tableStateHolder: TableState;

export const AgencyList = () => {
    const { t } = useTranslation();
    const [agencies, setAgencies] = useState([]);
    const [numberOfAgencies, setNumberOfAgencies] = useState(0);
    const [tableState, setTableState] = useState<TableState>({
        current: 1,
        sortBy: undefined,
        order: undefined,
        pageSize: 10,
    });

    const [isLoading, setIsLoading] = useState(true);

    const { can } = useUserPermissions();
    const { isEnabled } = useFeatureContext();
    const isTopicsFeatureActive = isEnabled(FeatureFlag.TopicsInRegistration);

    const navigate = useNavigate();

    function defineTableColumns(): ColumnsType<AgencyData> {
        return [
            {
                title: t('agency.name'),
                dataIndex: 'name',
                key: 'name',
                sorter: (a, b) => a.name?.toLowerCase().localeCompare(b.name?.toLowerCase()),
                width: 100,
                ellipsis: true,
                className: 'agencyList__column',
                fixed: 'left',
            },
            {
                title: t('agency.description'),
                dataIndex: 'description',
                key: 'description',
                sorter: (a, b) => a.description.localeCompare(b.description),
                width: 200,
                ellipsis: true,
                className: 'agencyList__column',
            },
            {
                title: t('agency.postcode'),
                dataIndex: 'postcode',
                key: 'postcode',
                sorter: (a, b) => a.postcode.localeCompare(b.postcode),
                width: 100,
                ellipsis: true,
                className: 'agencyList__column',
            },
            {
                title: t('agency.city'),
                dataIndex: 'city',
                key: 'city',
                sorter: (a, b) => a.city.localeCompare(b.city),
                width: 100,
                ellipsis: true,
                className: 'agencyList__column',
            },
            ...(can(PermissionAction.Read, Resource.Topic)
                ? [
                      {
                          title: t('topics.title'),
                          dataIndex: 'topics',
                          key: 'topics',
                          width: 100,
                          ellipsis: true,
                          render: (topics: TopicData[]) => {
                              if (topics) {
                                  const visibleTopics = [...topics];

                                  if (isTopicsFeatureActive && visibleTopics.length === 0) {
                                      return (
                                          <div className="TopicList__agencies" style={{ color: 'red' }}>
                                              {t('agency.noTopics')}
                                          </div>
                                      );
                                  }

                                  return visibleTopics.map((topicItem) => {
                                      return topicItem ? (
                                          <div key={topicItem.id} className="TopicList__agencies">
                                              <span>{topicItem.name}</span>
                                          </div>
                                      ) : (
                                          ''
                                      );
                                  });
                              }

                              return null;
                          },
                          className: 'agencyList__column',
                      },
                  ]
                : []),
            {
                title: t('agency.online.title'),
                dataIndex: 'offline',
                key: 'offline',
                sorter: (a, b) => (a.offline > b.offline ? 1 : -1),
                width: 100,
                ellipsis: true,
                render: (offline: Boolean) => {
                    return offline ? 'NEIN' : 'JA';
                },
                className: 'agencyListOnline__column',
            },
            {
                width: 60,
                title: t('status'),
                dataIndex: 'status',
                key: 'status',
                ellipsis: true,
                render: (status: Status) => {
                    return <StatusIcons status={status} />;
                },
                className: 'agencyList__column',
            },
            {
                width: 80,
                title: '',
                key: 'edit',
                render: (_: any, record: AgencyData) => {
                    return (
                        <div className="tableActionWrapper">
                            <EditButtons
                                isDisabled={record.status === 'IN_DELETION'}
                                handleEdit={() => {
                                    tableStateHolder = tableState;
                                    pubsub.publishEvent(PubSubEvents.AGENCY_UPDATE, record);
                                    navigate(`${routePathNames.agencyEditGeneral.replace(':id', record.id)}`);
                                }}
                                handleDelete={() => {
                                    tableStateHolder = tableState;
                                    pubsub.publishEvent(PubSubEvents.AGENCY_DELETE, record);
                                }}
                                record={record}
                                resource={Resource.Agency}
                            />
                        </div>
                    );
                },
                className: 'agencyList__column',
                fixed: 'right',
            },
        ];
    }

    const [columnsWidth, setColumnsWidth] = useState(defineTableColumns().map(({ width }) => width));

    const reloadAgencyList = () => {
        setIsLoading(true);
        getAgencyData(tableState).then((result) => {
            setAgencies(result.data);
            setNumberOfAgencies(result.total);
            setIsLoading(false);
        });
    };

    useEffect(() => pubsub.subscribe(PubSubEvents.AGENCYLIST_UPDATE, () => setTableState({ ...tableStateHolder })), []);

    useEffect(() => {
        reloadAgencyList();
    }, [tableState]);

    const tableChangeHandler = (pagination: any, filters: any, sorter: any) => {
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
    };

    const pagination = {
        total: numberOfAgencies,
        current: tableState.current,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30'],
    };

    const handleResize = useCallback(
        (index) =>
            (_, { size }) => {
                const newColumnsWidth = [...columnsWidth];
                newColumnsWidth[index] = size.width;
                setColumnsWidth(newColumnsWidth);
            },
        [columnsWidth],
    );

    const mergeColumns = defineTableColumns().map((col, index) => ({
        ...col,
        width: columnsWidth[index],
        onHeaderCell: (column) => ({
            width: column.width,
            onResize: handleResize(index),
        }),
    }));

    return (
        <Page>
            <Page.Title titleKey="agency" subTitleKey="agency.title.text" />
            {can(PermissionAction.Create, Resource.Agency) && (
                <Space align="baseline">
                    <Button
                        className="mb-m mr-sm"
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            tableStateHolder = tableState;
                            navigate(`${routePathNames.agencyAdd}/general`);
                            pubsub.publishEvent(PubSubEvents.AGENCY_UPDATE, emptyAgencyModel);
                        }}
                    >
                        {t('new')}
                    </Button>
                </Space>
            )}
            <Table
                loading={isLoading}
                className="agencyList editableTable"
                dataSource={agencies}
                columns={mergeColumns}
                scroll={{
                    x: 'max-content',
                    y: 'auto',
                }}
                onChange={tableChangeHandler}
                pagination={pagination}
                rowKey="id"
                components={{
                    header: {
                        cell: ResizableTitle,
                    },
                }}
            />
            <AgencyDeletionModal />
        </Page>
    );
};

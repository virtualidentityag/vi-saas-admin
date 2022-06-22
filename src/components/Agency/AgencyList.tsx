import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import Title from "antd/es/typography/Title";
import { Button, Table } from "antd";

import { PlusOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/lib/table";
import AgencyFormModal from "./AgencyFormModal";

import EditButtons from "../EditableTable/EditButtons";
import getAgencyData from "../../api/agency/getAgencyData";
import { AgencyData } from "../../types/agency";
import { Status } from "../../types/status";
import StatusIcons from "../EditableTable/StatusIcons";
import pubsub, { PubSubEvents } from "../../state/pubsub/PubSub";
import AgencyDeletionModal from "./AgencyDeletionModal";
import ResizableTitle from "../Resizable/Resizable";

const emptyAgencyModel: AgencyData = {
  id: null,
  name: "",
  city: "",
  topics: [],
  topicIds: [],
  consultingType: "",
  description: "",
  offline: true,
  online: false,
  postcode: "",
  teamAgency: "true",
  status: undefined,
};

let tableStateHolder: TableState;

function AgencyList() {
  const { t } = useTranslation();
  const [agencies, setAgencies] = useState([]);
  const [numberOfAgencies, setNumberOfAgencies] = useState(0);
  const [tableState, setTableState] = useState<TableState>({
    current: 1,
    sortBy: undefined,
    order: undefined,
  });

  const [isLoading, setIsLoading] = useState(true);

  function defineTableColumns(): ColumnsType<AgencyData> {
    return [
      {
        title: t("agency.name"),
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => a.name.localeCompare(b.name),
        width: 150,
        ellipsis: true,
        className: "agencyList__column",
      },
      {
        title: t("agency.description"),
        dataIndex: "description",
        key: "description",
        sorter: (a, b) => a.description.localeCompare(b.description),
        width: 200,
        ellipsis: true,
        className: "agencyList__column",
      },
      {
        title: t("agency.postcode"),
        dataIndex: "postcode",
        key: "postcode",
        sorter: (a, b) => a.postcode.localeCompare(b.postcode),
        width: 100,
        ellipsis: true,
        className: "agencyList__column",
      },
      {
        title: t("agency.city"),
        dataIndex: "city",
        key: "city",
        sorter: (a, b) => a.city.localeCompare(b.city),
        width: 100,
        ellipsis: true,
        className: "agencyList__column",
      },
      {
        title: t("topics.title"),
        dataIndex: "topics",
        key: "topics",
        width: 100,
        ellipsis: true,
        render: (topics: any[]) => {
          if (topics) {
            const visibleTopics = [...topics];

            return visibleTopics.map((topicItem) => {
              return topicItem ? (
                <div key={topicItem.id} className="TopicList__agencies">
                  <span>{topicItem.name}</span>
                </div>
              ) : (
                ""
              );
            });
          }

          return null;
        },
        className: "agencyList__column",
      },
      {
        title: t("agency.teamAgency"),
        dataIndex: "teamAgency",
        key: "teamAgency",
        sorter: (a, b) => (a.teamAgency > b.teamAgency ? 1 : -1),
        width: 100,
        ellipsis: true,
        render: (data: string) => {
          return data === "true" ? "JA" : "NEIN";
        },
        className: "agencyList__column",
      },
      {
        width: 80,
        title: t("status"),
        dataIndex: "status",
        key: "status",
        ellipsis: true,
        render: (status: Status) => {
          return <StatusIcons status={status} />;
        },
        className: "agencyList__column",
      },
      {
        width: 88,
        title: "",
        key: "edit",
        render: (_: any, record: AgencyData) => {
          return (
            <div className="tableActionWrapper">
              <EditButtons
                isDisabled={record.status === "IN_DELETION"}
                handleEdit={() => {
                  tableStateHolder = tableState;
                  pubsub.publishEvent(PubSubEvents.AGENCY_UPDATE, record);
                }}
                handleDelete={() => {
                  tableStateHolder = tableState;
                  pubsub.publishEvent(PubSubEvents.AGENCY_DELETE, record);
                }}
                record={record}
              />
            </div>
          );
        },
        className: "agencyList__column",
      },
    ];
  }

  const [columns, setColumns] = useState(defineTableColumns());

  const reloadAgencyList = () => {
    setIsLoading(true);
    getAgencyData(tableState).then((result) => {
      setAgencies(result.data);
      setNumberOfAgencies(result.total);
      setIsLoading(false);
    });
  };

  useEffect(
    () =>
      pubsub.subscribe(PubSubEvents.AGENCYLIST_UPDATE, () =>
        setTableState({ ...tableStateHolder })
      ),
    []
  );

  useEffect(() => {
    reloadAgencyList();
  }, [tableState]);

  const tableChangeHandler = (pagination: any, filters: any, sorter: any) => {
    if (sorter.field) {
      const sortBy = sorter.field.toUpperCase();
      const order = sorter.order === "descend" ? "DESC" : "ASC";
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
    total: numberOfAgencies,
    current: tableState.current,
    pageSize: 10,
  };

  const handleResize =
    (index) =>
    (_, { size }) => {
      const newColumns = [...columns];
      newColumns[index] = { ...newColumns[index], width: size.width };
      setColumns(newColumns);
    };

  const mergeColumns = columns.map((col, index) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
      onResize: handleResize(index),
    }),
  }));

  return (
    <>
      <Title level={3}>{t("agency")}</Title>
      <p>{t("agency.title.text")}</p>

      <Button
        className="mb-m mr-sm"
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          tableStateHolder = tableState;
          pubsub.publishEvent(PubSubEvents.AGENCY_UPDATE, emptyAgencyModel);
        }}
      >
        {t("new")}
      </Button>

      <Table
        loading={isLoading}
        className="agencyList editableTable"
        dataSource={agencies}
        columns={mergeColumns}
        scroll={{
          x: "max-content",
          y: "100%",
        }}
        // sticky
        // tableLayout="fixed"
        onChange={tableChangeHandler}
        pagination={pagination}
        rowKey="id"
        style={{
          width: "100%",
        }}
        components={{
          header: {
            cell: ResizableTitle,
          },
        }}
      />

      <AgencyFormModal />
      <AgencyDeletionModal />
    </>
  );
}

export default AgencyList;

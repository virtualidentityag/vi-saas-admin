import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import Title from "antd/es/typography/Title";
import { Button, Table } from "antd";

import { PlusOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/lib/table";
import { isDisabled } from "@testing-library/user-event/dist/utils";
import TopicFormModal from "./TopicFormModal";

import getTopicData from "../../api/topic/getTopicData";
import { TopicData } from "../../types/topic";
import StatusIcons from "../EditableTable/StatusIcons";
import pubsub, { PubSubEvents } from "../../state/pubsub/PubSub";
import TopicDeletionModal from "./TopicDeletionModal";
import EditButtons from "../EditableTable/EditButtons";

const emptyTopicModel: TopicData = {
  id: null,
  name: "",
  description: "",
  internalIdentifier: null,
  status: undefined,
};

let tableStateHolder: TableState;

function TopicList() {
  const { t } = useTranslation();
  const [topics, setTopics] = useState([]);
  const [numberOfTopics, setNumberOfTopics] = useState(0);
  const [tableState, setTableState] = useState<TableState>({
    current: 1,
    sortBy: undefined,
    order: undefined,
  });

  const [isLoading, setIsLoading] = useState(true);

  function defineTableColumns(): ColumnsType<TopicData> {
    return [
      {
        title: t("topic.name"),
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => a.name.localeCompare(b.name),
        width: 150,
        ellipsis: true,
        fixed: "left",
      },
      {
        title: t("topic.description"),
        dataIndex: "description",
        key: "description",
        sorter: (a, b) => a.description.localeCompare(b.description),
        width: 350,
        ellipsis: true,
        fixed: "left",
      },
      {
        title: t("topic.internalIdentifier"),
        dataIndex: "internalIdentifier",
        key: "internalIdentifier",
        sorter: (a, b) =>
          (a.internalIdentifier || "a").localeCompare(
            b.internalIdentifier || "b"
          ),
        width: 150,
        ellipsis: true,
        fixed: "left",
      },
      {
        width: 80,
        title: t("status"),
        dataIndex: "status",
        key: "status",
        sorter: (a, b) => (a.status > b.status ? 1 : -1),
        ellipsis: true,
        render: (status: string) => {
          return (
            <StatusIcons status={status === "ACTIVE" ? "ACTIVE" : "INACTIVE"} />
          );
        },
      },
      {
        width: 88,
        title: "",
        key: "edit",
        render: (_: any, record: TopicData) => {
          return (
            <div className="tableActionWrapper">
              <EditButtons
                isDisabled={record.status === "IN_DELETION"}
                handleEdit={() => {
                  tableStateHolder = tableState;
                  pubsub.publishEvent(PubSubEvents.TOPIC_UPDATE, record);
                }}
                handleDelete={isDisabled}
                record={record}
                hide={["delete"]}
              />
            </div>
          );
        },
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

  useEffect(
    () =>
      pubsub.subscribe(PubSubEvents.TOPICLIST_UPDATE, () =>
        setTableState({ ...tableStateHolder })
      ),
    []
  );

  useEffect(() => {
    reloadTopicList();
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
    total: numberOfTopics,
    current: tableState.current,
    pageSize: 10,
  };

  return (
    <>
      <Title level={3}>{t("topics.title")}</Title>
      <p>{t("topics.title.text")}</p>

      <Button
        className="mb-m mr-sm"
        type="primary"
        icon={<PlusOutlined />}
        onClick={() =>
          pubsub.publishEvent(PubSubEvents.TOPIC_UPDATE, emptyTopicModel)
        }
      >
        {t("new")}
      </Button>

      <Table
        loading={isLoading}
        className="editableTable"
        dataSource={topics}
        columns={defineTableColumns()}
        scroll={{
          x: "max-content",
          y: "100%",
        }}
        sticky
        tableLayout="fixed"
        onChange={tableChangeHandler}
        pagination={pagination}
        rowKey="name"
        style={{
          width: "100%",
        }}
      />

      <TopicFormModal />
      <TopicDeletionModal />
    </>
  );
}

export default TopicList;
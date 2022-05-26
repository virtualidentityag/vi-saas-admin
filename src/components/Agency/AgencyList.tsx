import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import Title from "antd/es/typography/Title";
import { Button, Table } from "antd";

import { PlusOutlined } from "@ant-design/icons";
import AgencyFormModal from "./AgencyFormModal";

import EditButtons from "../EditableTable/EditButtons";
import getAgencyData from "../../api/agency/getAgencyData";
import { AgencyData } from "../../types/agency";
import { Status } from "../../types/status";
import StatusIcons from "../EditableTable/StatusIcons";
import pubsub, { PubSubEvents } from "../../state/pubsub/PubSub";
import AgencyDeletionModal from "./AgencyDeletionModal";

const emptyAgencyModel: AgencyData = {
  id: null,
  name: "",
  city: "",
  consultingType: "",
  description: "",
  offline: true,
  postcode: "",
  teamAgency: "true",
};

function useTableColumns(): any {
  const { t } = useTranslation();
  return [
    {
      title: t("agency.name"),
      dataIndex: "name",
      key: "name",
      sorter: (a: AgencyData, b: AgencyData) => a.name.localeCompare(b.name),
      width: 150,
      ellipsis: true,
      fixed: "left",
      editable: true,
    },
    {
      title: t("agency.description"),
      dataIndex: "description",
      key: "description",
      sorter: (a: AgencyData, b: AgencyData) =>
        a.description.localeCompare(b.description),
      width: 200,
      ellipsis: true,
      fixed: "left",
      editable: true,
    },
    {
      title: t("agency.postcode"),
      dataIndex: "postcode",
      key: "postcode",
      sorter: (a: AgencyData, b: AgencyData) =>
        a.postcode.localeCompare(b.postcode),
      width: 100,
      ellipsis: true,
      fixed: "left",
      editable: true,
    },
    {
      title: t("agency.city"),
      dataIndex: "city",
      key: "city",
      sorter: (a: AgencyData, b: AgencyData) => a.city.localeCompare(b.city),
      width: 100,
      ellipsis: true,
      fixed: "left",
      editable: true,
    },
    {
      title: t("agency.teamAgency"),
      dataIndex: "teamAgency",
      key: "teamAgency",
      sorter: (a: AgencyData, b: AgencyData) => a.teamAgency !== b.teamAgency,
      width: 100,
      ellipsis: true,
      fixed: "left",
      editable: true,
      render: (data: string) => {
        return data === "true" ? "JA" : "NEIN";
      },
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
    },
    {
      width: 88,
      title: "",
      key: "edit",
      render: (_: any, record: AgencyData) => {
        return (
          <div className="tableActionWrapper">
            <EditButtons
              handleEdit={() =>
                pubsub.publishEvent(PubSubEvents.AGENCY_UPDATE, record)
              }
              handleDelete={() =>
                pubsub.publishEvent(PubSubEvents.AGENCY_DELETE, record)
              }
              record={record}
            />
          </div>
        );
      },
    },
  ];
}

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

  const reloadAgencyList = () => {
    setIsLoading(true);
    getAgencyData(tableState).then((result) => {
      setAgencies(result.data);
      setNumberOfAgencies(result.total);
      setIsLoading(false);
    });
  };

  useEffect(
    () => pubsub.subscribe(PubSubEvents.AGENCYLIST_UPDATE, reloadAgencyList),
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
        sortBy: undefined,
        order: undefined,
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

  return (
    <>
      <Title level={3}>{t("agency")}</Title>
      <p>{t("agency.title.text")}</p>

      <Button
        className="mb-m mr-sm"
        type="primary"
        icon={<PlusOutlined />}
        onClick={() =>
          pubsub.publishEvent(PubSubEvents.AGENCY_UPDATE, emptyAgencyModel)
        }
      >
        {t("new")}
      </Button>

      <Table
        loading={isLoading}
        className="editableTable"
        dataSource={agencies}
        columns={useTableColumns()}
        scroll={{
          x: "max-content",
          y: "100%",
        }}
        sticky
        tableLayout="fixed"
        onChange={tableChangeHandler}
        pagination={pagination}
      />

      <AgencyFormModal />
      <AgencyDeletionModal />
    </>
  );
}

export default AgencyList;
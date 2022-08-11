import { Button, Space, Table, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { PlusOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { ColumnsType } from "antd/lib/table";
import Title from "antd/es/typography/Title";
import { useLocation } from "react-router";
import EditButtons from "../EditableTable/EditButtons";
import {
  ConsultantInterface,
  AgencyEditData,
  AgencyEventTypes,
} from "../../types/agencyEdit";
import ResizableTitle from "../Resizable/Resizable";
import ErstberatungNewModal from "./ErstberatungNewModal";
import ErstberatungEditModal from "./ErstberatungEditModal";
import getAgencyEventTypes from "../../api/agency/getAgencyEventTypes";
import getConsultantForAgencyEventTypes from "../../api/agency/getConsultantForAgencyEventTypes";
import EventTypeDeletionModal from "./EventTypeDeletionModal";

const { Paragraph } = Typography;

export default function AgencieEditErstberatung() {
  const { t } = useTranslation();
  const [topics, setTopics] = useState([]);
  const [apiAgencyEventTypes, setApiAgencyEventTypes] = useState<
    AgencyEventTypes[]
  >([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [editableData, setEditableData] = useState(undefined);
  const [eventTypeDelete, setEventTypeDelete] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [tableState] = useState<TableState>({
    current: 1,
    sortBy: undefined,
    order: undefined,
  });
  const currentPath = useLocation().pathname;
  const [, agencyId] = currentPath.match(/.*\/([^/]+)\/[^/]+/);

  const transformData = (eventTypes: AgencyEventTypes[]) => {
    const agencyEventTypes = [];
    eventTypes.forEach((event: AgencyEventTypes) => {
      agencyEventTypes.push({
        id: event.id,
        name: event.title,
        description: event.description,
        url: `https://calcom-develop.suchtberatung.digital/team/${event.slug}`,
        duration: event.length,
        advisor: null,
        location: "Videoberatung",
      });
    });
    return agencyEventTypes;
  };

  const getAgencyData = () => {
    getAgencyEventTypes(agencyId).then((resp: AgencyEventTypes[]) => {
      setApiAgencyEventTypes(resp);
      const agencyEventTypes = transformData(resp);
      setTopics(agencyEventTypes);
      setIsLoading(false);
    });
  };

  const agencyDataConsultantsTransform = (
    resp: AgencyEventTypes,
    data: AgencyEditData
  ) => {
    const newAdvisors = [];
    resp.consultants.map((consultant: ConsultantInterface) => {
      return newAdvisors.push({
        id: consultant.consultantId,
        name: consultant.consultantName,
      });
    });
    return { ...data, advisor: newAdvisors };
  };

  const handleEditTable = (data: AgencyEditData) => {
    getConsultantForAgencyEventTypes(agencyId, data.id).then(
      (resp: AgencyEventTypes) => {
        const editableDataContent = agencyDataConsultantsTransform(resp, data);
        setEditableData(editableDataContent);
        setShowEditModal(true);
      }
    );
  };

  const handleConsultantTypeNew = () => {
    setShowNewModal(true);
  };

  const handleCancelNew = () => {
    setShowNewModal(false);
  };

  const handleSaveNew = () => {
    setShowNewModal(false);
    getAgencyData();
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
  };

  const handleSaveEdit = () => {
    setShowEditModal(false);
    getAgencyData();
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleSaveDelete = () => {
    setShowDeleteModal(false);
    setEventTypeDelete(undefined);
    getAgencyData();
  };

  const handleDeleteTable = (data: AgencyEditData) => {
    setShowDeleteModal(true);
    setEventTypeDelete(data);
  };

  function defineTableColumns(): ColumnsType<AgencyEditData> {
    return [
      {
        title: t("agency.edit.erstberatung.table.appointment_label"),
        dataIndex: "name",
        key: "name",
        width: 350,
        ellipsis: true,
        fixed: "left",
      },
      {
        title: t("agency.edit.erstberatung.table.location"),
        dataIndex: "location",
        key: "location",
        width: 150,
        ellipsis: true,
      },
      {
        title: t("agency.edit.erstberatung.table.duration"),
        dataIndex: "duration",
        key: "duration",
        width: 150,
        ellipsis: true,
      },
      {
        width: 88,
        title: "",
        key: "edit",
        render: (_: any, record: AgencyEditData) => {
          return (
            <div className="tableActionWrapper">
              <EditButtons
                isDisabled={record.status === "IN_DELETION"}
                handleEdit={handleEditTable}
                handleDelete={handleDeleteTable}
                record={record}
              />
            </div>
          );
        },
        fixed: "right",
      },
    ];
  }

  const [columnsWidth, setColumnsWidth] = useState(
    defineTableColumns().map(({ width }) => width)
  );

  const handleResize = useCallback(
    (index) =>
      (_, { size }) => {
        const newColumnsWidth = [...columnsWidth];
        newColumnsWidth[index] = size.width;
        setColumnsWidth(newColumnsWidth);
      },
    [columnsWidth]
  );

  const mergeColumns = defineTableColumns().map((col, index) => ({
    ...col,
    width: columnsWidth[index],
    onHeaderCell: (column) => ({
      width: column.width,
      onResize: handleResize(index),
    }),
  }));

  useEffect(() => {
    getAgencyData();
  }, [tableState, agencyId]);

  return (
    <>
      <Title level={3}>{t("agency.edit.erstberatung.title")}</Title>
      <Paragraph>{t("agency.edit.erstberatung.description")}</Paragraph>
      <Space align="baseline">
        <Button
          className="mb-m mr-sm"
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleConsultantTypeNew}
        >
          {t("agency.edit.erstberatung.button_label")}
        </Button>
      </Space>
      <Table
        loading={isLoading}
        className="agencyList editableTable"
        dataSource={topics}
        columns={mergeColumns}
        scroll={{
          x: "max-content",
          y: "100%",
        }}
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
      <ErstberatungNewModal
        showEditModal={showNewModal}
        handleCancel={handleCancelNew}
        handleSave={handleSaveNew}
        apiData={apiAgencyEventTypes}
      />
      <ErstberatungEditModal
        showEditModal={showEditModal}
        handleCancel={handleCancelEdit}
        handleSave={handleSaveEdit}
        editableData={editableData}
        apiData={apiAgencyEventTypes}
      />
      <EventTypeDeletionModal
        showDeleteModal={showDeleteModal}
        handleCancel={handleCancelDelete}
        handleSave={handleSaveDelete}
        eventType={eventTypeDelete}
      />
    </>
  );
}
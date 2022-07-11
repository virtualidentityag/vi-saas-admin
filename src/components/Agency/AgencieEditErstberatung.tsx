import { Button, Space, Table, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { PlusOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { ColumnsType } from "antd/lib/table";
import Title from "antd/es/typography/Title";
import EditButtons from "../EditableTable/EditButtons";
import { AgencyEditData } from "../../types/agencyEdit";
import ResizableTitle from "../Resizable/Resizable";
import ErstberatungNewModal from "./ErstberatungNewModal";
import ErstberatungEditModal from "./ErstberatungEditModal";

const { Paragraph } = Typography;

export default function AgencieEditErstberatung() {
  const { t } = useTranslation();
  const [topics, setTopics] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [editableData, setEditableData] = useState(undefined);
  const [tableState] = useState<TableState>({
    current: 1,
    sortBy: undefined,
    order: undefined,
  });

  // TODO: Change typing to AgencyData
  const fakeData: AgencyEditData[] = [
    {
      id: 1,
      name: "Erstberatung, alle",
      description: undefined,
      url: "https://onlineberatung-tenant.de/terminname",
      duration: 60,
      advisor: undefined,
      location: "Videoberatung",
    },
  ];

  const handleEditTable = (data: AgencyEditData) => {
    setEditableData(data);
    setShowEditModal(true);
  };

  const handleConsultantTypeNew = () => {
    setShowNewModal(true);
  };

  const handleCancelNew = () => {
    setShowNewModal(false);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
  };

  const handleDeleteTable = () => {};

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
    setTopics(fakeData);
  }, [tableState]);

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
      />
      <ErstberatungEditModal
        showEditModal={showEditModal}
        handleCancel={handleCancelEdit}
        data={editableData}
      />
    </>
  );
}

import React from "react";
import { Button, Form, Modal, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import Title from "antd/es/typography/Title";
import EditableTableCell from "./EditableTableCell";
import EditableTableProps from "../../types/editabletable";

function EditableTable({
  handleBtnAdd,
  isLoading,
  source,
  columns,
  isDeleteModalVisible,
  handleOnDelete,
  handleDeleteModalCancel,
  handleDeleteModalTitle,
  handleDeleteModalText,
  form,
}: EditableTableProps) {
  const { t } = useTranslation();

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleBtnAdd}>
        {t("new")}
      </Button>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableTableCell,
            },
          }}
          loading={isLoading}
          className="tenantsTable"
          dataSource={source}
          columns={columns}
          scroll={{
            x: "max-content",
            y: "100%",
          }}
          sticky
          tableLayout="fixed"
          // bordered
        />
      </Form>

      <Modal
        title={<Title level={2}>{handleDeleteModalTitle}</Title>}
        visible={isDeleteModalVisible}
        onOk={handleOnDelete}
        onCancel={handleDeleteModalCancel}
        cancelText="ABBRECHEN"
        closable={false}
        centered
      >
        <p>{handleDeleteModalText}</p>
      </Modal>
    </>
  );
}

export default EditableTable;

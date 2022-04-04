import React from "react";
import { Button, Modal, Popover, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import Title from "antd/es/typography/Title";

import { useSelector } from "react-redux";
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
}: EditableTableProps) {
  const { t } = useTranslation();
  const { tenantData } = useSelector((state: any) => state);
  const { licensing } = tenantData;
  const { allowedNumberOfUsers } = licensing;

  const AddButton = (
    <Button
      className="mb-m mr-sm"
      type="primary"
      icon={<PlusOutlined />}
      onClick={handleBtnAdd}
      disabled={source.length >= allowedNumberOfUsers}
    >
      {t("new")}
    </Button>
  );

  return (
    <>
      <div>
        {source.length >= allowedNumberOfUsers ? (
          <Popover
            placement="bottomRight"
            content={t("counselor.new.help", { number: allowedNumberOfUsers })}
            title={t("notice")}
            trigger="hover"
          >
            {AddButton}
          </Popover>
        ) : (
          AddButton
        )}
        <span>
          {source.length}/{allowedNumberOfUsers} {t("counselor.title")}
        </span>
      </div>

      <Table
        loading={isLoading}
        className="editableTable"
        dataSource={source}
        columns={columns}
        scroll={{
          x: "max-content",
          y: "100%",
        }}
        sticky
        tableLayout="fixed"
        rowClassName={(record, index) => {
          console.log(index, record.status);

          /* if (record.status !== "null") {
            return record.status;
          } */
          return "ERROR";
        }}
      />

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

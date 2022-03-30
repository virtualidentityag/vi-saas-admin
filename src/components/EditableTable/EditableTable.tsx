import React from "react";
import { Modal, Table } from "antd";

import Title from "antd/es/typography/Title";

import EditableTableProps from "../../types/editabletable";
import AddButton from "./AddButton";

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
  allowedNumberOfUsers = 9999,
}: EditableTableProps) {
  return (
    <>
      <AddButton
        allowedNumberOfUsers={allowedNumberOfUsers}
        sourceLength={source.length}
        handleBtnAdd={handleBtnAdd}
      />

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

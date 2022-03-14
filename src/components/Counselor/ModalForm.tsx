import { Form, Modal } from "antd";
import React, { useEffect } from "react";
import Title from "antd/es/typography/Title";
import Counselor from "./Counselor";
import { CounselorData } from "../../types/counselor";

interface ModalFormProps {
  isModalCreateVisible: boolean;
  handleOnAddCounselor: (arg0: CounselorData) => void;
  handleCreateModalCancel: () => void;
  counselor: CounselorData;
  title: string;
  isInAddMode: boolean;
}

function ModalForm({
  isModalCreateVisible,
  handleOnAddCounselor,
  handleCreateModalCancel,
  counselor,
  title,
  isInAddMode,
}: ModalFormProps) {
  const [form] = Form.useForm();

  return (
    <Modal
      destroyOnClose
      title={<Title level={2}>{title}</Title>}
      visible={isModalCreateVisible}
      onOk={() => {
        form.validateFields().then((values) => {
          handleOnAddCounselor(values);
        });
      }}
      onCancel={() => {
        handleCreateModalCancel();
        form.resetFields();
      }}
    >
      <Counselor
        counselor={counselor}
        isInAddMode={isInAddMode}
        modalForm={form}
      />
    </Modal>
  );
}

export default ModalForm;

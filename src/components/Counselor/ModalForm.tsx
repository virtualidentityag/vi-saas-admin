import { Form, Modal } from "antd";
import React, { useState } from "react";
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
  const [buttonDisabled, setButtonDisabled] = useState(true);

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
        form.resetFields();
        handleCreateModalCancel();
      }}
      okButtonProps={{
        disabled: buttonDisabled,
      }}
    >
      <Counselor
        counselor={counselor}
        isInAddMode={isInAddMode}
        modalForm={form}
        setButtonDisabled={setButtonDisabled}
      />
    </Modal>
  );
}

export default ModalForm;

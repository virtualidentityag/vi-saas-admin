import { Form, Modal } from "antd";
import React, { useState } from "react";
import Title from "antd/es/typography/Title";

import { ModalFormProps } from "../../types/modalForm";

function ModalForm({
  isModalCreateVisible,
  handleOnAddElement,
  handleCreateModalCancel,
  title,
  isInAddMode,
  renderFormFields,
  formData,
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
          handleOnAddElement(values);
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
      {renderFormFields({ form, setButtonDisabled, isInAddMode, formData })}
    </Modal>
  );
}

export default ModalForm;

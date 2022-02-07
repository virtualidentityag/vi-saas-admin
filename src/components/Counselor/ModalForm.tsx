import { Form, Modal } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import Title from "antd/es/typography/Title";
import Counselor from "./Counselor";
import { CounselorData } from "../../types/counselor";

interface ModalFormProps {
  isModalCreateVisible: boolean;
  handleOnAddCounselor: (arg0: CounselorData) => void;
  handleCreateModalCancel: () => void;
  newCounselor: CounselorData;
}

function ModalForm({
  isModalCreateVisible,
  handleOnAddCounselor,
  handleCreateModalCancel,
  newCounselor,
}: ModalFormProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  return (
    <Modal
      title={<Title level={2}>{t("counselor.modal.headline.add")}</Title>}
      visible={isModalCreateVisible}
      onOk={() => {
        form.validateFields().then((values) => {
          handleOnAddCounselor(values);
          form.resetFields();
        });
      }}
      onCancel={handleCreateModalCancel}
    >
      <Counselor counselor={newCounselor} isInAddMode modalForm={form} />
    </Modal>
  );
}

export default ModalForm;

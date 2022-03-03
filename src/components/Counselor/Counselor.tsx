import React, { useState } from "react";
import {
  FormOutlined,
  SaveOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import {
  Form,
  Input,
  Button,
  message,
  Modal,
  FormInstance,
  Select,
} from "antd";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { CounselorData } from "../../types/counselor";

const { Option } = Select;

export const defaultCounselor: CounselorData = {
  lastname: "",
  firstname: "",
  email: "",
  active: true,
  gender: "",
  id: "",
  phone: "",
  agency: [],
  username: "",
  key: "",
  formalLanguage: true,
  absent: true,
  absenceMessage: "",
};

interface Props {
  counselor: CounselorData;
  isInAddMode?: boolean;
  modalForm?: FormInstance;
  handleDeleteCounselor?: (arg0: CounselorData) => void;
  handleEditCounselor?: (arg0: CounselorData) => void;
}

function Counselor({
  counselor,
  isInAddMode,
  modalForm,
  handleDeleteCounselor,
  handleEditCounselor,
}: Props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const currentForm = modalForm || form;

  const [editing, setEditing] = useState(isInAddMode);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    lastname,
    firstname,
    email,
    phone,
    active,
    agency,
    username,
    id,
    formalLanguage,
    absent,
    absenceMessage,
  } = counselor;

  const toggleEditing = () => {
    setEditing(!editing);
  };

  const handleOnDelete = () => {
    currentForm.validateFields().then((values) => {
      setIsModalVisible(false);
      setEditing(false);
      if (handleDeleteCounselor) {
        handleDeleteCounselor(values);
      }
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const onFormSubmit = (values: any) => {
    setEditing(!editing);
    if (handleEditCounselor) {
      handleEditCounselor(values);
    }
  };

  const onFinishFailed = () => {
    message.error({
      content: `Berater ${firstname} ${lastname} wurde NICHT aktualisiert!`,
      duration: 3,
    });
  };

  return (
    <>
      <Form
        form={currentForm}
        onFinish={onFormSubmit}
        onFinishFailed={onFinishFailed}
        size="small"
        labelAlign="left"
        labelWrap
        layout="vertical"
        initialValues={{
          firstname,
          lastname,
          agency,
          phone,
          email,
          username,
          id,
          formalLanguage,
          absent,
          absenceMessage,
        }}
      >
        <div className={clsx("counselor", !active && "inactive")}>
          <Form.Item
            label={t("firstname")}
            name="firstname"
            rules={[{ required: true }]}
          >
            <Input placeholder={t("placeholder.firstname")} />
          </Form.Item>

          <Form.Item
            label={t("lastname")}
            name="lastname"
            rules={[{ required: true }]}
          >
            <Input placeholder={t("placeholder.lastname")} />
          </Form.Item>

          <Form.Item name="id" hidden />
          <Form.Item
            label={t("email")}
            name="email"
            rules={[{ required: true }]}
          >
            <Input placeholder={t("placeholder.email")} />
          </Form.Item>
          <Form.Item label={t("agency")} name="agency">
            <Select disabled={agency.length === 1} placeholder={t("plsSelect")}>
              <Option value="Agentur 1">Agentur 1</Option>
              <Option value="Agentur 2">Agentur 2</Option>
              <Option value="Agentur 3">Agentur 3</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={t("counselor.username")}
            name="username"
            rules={[{ required: true }]}
          >
            <Input placeholder={t("placeholder.username")} />
          </Form.Item>
          <Form.Item
            label={t("counselor.formalLanguage")}
            name="formalLanguage"
            rules={[{ required: true }]}
          >
            <Select placeholder={t("plsSelect")}>
              <Option key={0} value>
                {t("yes")}
              </Option>
              <Option key={0} value={false}>
                {t("no")}
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={t("counselor.absent")}
            name="absent"
            rules={[{ required: true }]}
          >
            <Select placeholder={t("plsSelect")}>
              <Option key={0} value>
                {t("yes")}
              </Option>
              <Option key={0} value={false}>
                {t("no")}
              </Option>
            </Select>
          </Form.Item>

          {!isInAddMode && editing ? (
            <Button htmlType="submit" type="text" icon={<SaveOutlined />}>
              {t("save")}
            </Button>
          ) : (
            !isInAddMode && (
              <Button
                onClick={toggleEditing}
                type="text"
                key="edit"
                icon={<FormOutlined />}
              >
                {t("edit")}
              </Button>
            )
          )}
          {!isInAddMode && (
            <Button
              onClick={() => setIsModalVisible(true)}
              type="text"
              key="delete"
              icon={<UserDeleteOutlined />}
            >
              {t("delete")}
            </Button>
          )}
        </div>
      </Form>
      <Modal
        title={t("counselor.modal.headline.delete")}
        visible={isModalVisible}
        onOk={handleOnDelete}
        onCancel={handleModalCancel}
        cancelText={t("btn.cancel")}
        closable={false}
        centered
      >
        <p>{t("counselor.modal.delete.text")}</p>
      </Modal>
    </>
  );
}

export default Counselor;

import React, { useState } from "react";
import {
  FormOutlined,
  SaveOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import {
  Card,
  Avatar,
  Form,
  Input,
  Button,
  Select,
  message,
  Modal,
  FormInstance,
} from "antd";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { CounselorData } from "../../types/counselor";

const { Meta } = Card;

export const defaultCounselor: CounselorData = {
  lastName: "",
  firstName: "",
  email: "",
  active: true,
  gender: "",
  id: null,
  phone: "",
  agency: "",
  username: "",
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

  const { lastName, firstName, email, phone, active, agency, username, id } =
    counselor;

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

  const onFinishFailed = (errorInfo: any) => {
    message.error({
      content: `Berater ${firstName} ${lastName} wurde NICHT aktualisiert!,<br /> ${errorInfo}`,
      duration: 3,
    });
  };

  const description = (
    <>
      <Form.Item name="id" hidden />
      <Form.Item label={t("email")} name="email" rules={[{ required: true }]}>
        {editing ? <Input /> : email}
      </Form.Item>
      {/* <Form.Item label={t("phone")} name="phone">
        {editing ? <Input /> : phone}
      </Form.Item>
      <Form.Item label={t("counselor.agency")} name="agency">
        {editing ? (
          <Select>
            <Option value="Agentur 1">Agentur 1</Option>
            <Option value="Agentur 2">Agentur 2</Option>
            <Option value="Agentur 3">Agentur 3</Option>
          </Select>
        ) : (
          agency
        )}
      </Form.Item> */}
      <Form.Item
        label={t("counselor.username")}
        name="username"
        rules={[{ required: true }]}
      >
        {editing ? <Input /> : username}
      </Form.Item>
    </>
  );

  return (
    <>
      <Form
        form={currentForm}
        onFinish={onFormSubmit}
        onFinishFailed={onFinishFailed}
        size="small"
        labelCol={{ flex: "110px" }}
        labelAlign="left"
        labelWrap
        wrapperCol={{ flex: 1 }}
        initialValues={{
          firstName,
          lastName,
          agency,
          phone,
          email,
          username,
          id,
        }}
      >
        <Card
          className={clsx(
            "counselor",
            !active && "inactive",
            editing && "editMode"
          )}
          actions={[
            !isInAddMode && editing ? (
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
            ),
            !isInAddMode && (
              <Button
                onClick={() => setIsModalVisible(true)}
                type="text"
                key="delete"
                icon={<UserDeleteOutlined />}
              >
                {t("delete")}
              </Button>
            ),
          ]}
        >
          <Meta
            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
            title={
              <>
                <Form.Item name="firstName" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <span className="text">{firstName}</span>

                <Form.Item name="lastName" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <span className="text">{lastName}</span>
              </>
            }
            description={description}
          />
        </Card>
      </Form>
      <Modal
        title={t("counselor.modal.headline.delete")}
        visible={isModalVisible}
        onOk={handleOnDelete}
        onCancel={handleModalCancel}
      >
        <p>{t("counselor.modal.delete.text")}</p>
      </Modal>
    </>
  );
}

export default Counselor;

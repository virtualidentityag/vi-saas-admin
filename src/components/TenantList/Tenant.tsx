import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Form, Input, message, FormInstance, Spin } from "antd";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { BasicTenantData } from "../../types/tenant";

const { Item } = Form;

export const defaultTenant: BasicTenantData = {
  id: null,
  name: "",
  subdomain: "",
  createDate: "",
  licensing: { allowedNumberOfUsers: 0 },
  isSuperAdmin: false,
};

export interface Props {
  formData: BasicTenantData;
  isInAddMode?: boolean;
  modalForm: FormInstance;
  handleEditTenant?: (arg0: BasicTenantData) => void;
  setButtonDisabled: Dispatch<SetStateAction<boolean>>;
}

function Tenant({
  formData,
  isInAddMode = false,
  modalForm,
  handleEditTenant,
  setButtonDisabled,
}: Props) {
  const { t } = useTranslation();

  const [editing, setEditing] = useState(isInAddMode);

  useEffect(() => {
    modalForm.resetFields();
  }, [formData, modalForm]);

  const { id, name, subdomain, createDate, licensing } = formData;

  const onFormSubmit = (values: any) => {
    setEditing(!editing);
    if (handleEditTenant) {
      handleEditTenant(values);
    }
  };

  const onFinishFailed = () => {
    message.error({
      content: t("message.error.default"),
      duration: 3,
    });
  };

  return (
    <Spin spinning={false}>
      <Form
        form={modalForm}
        onFinish={onFormSubmit}
        onFinishFailed={onFinishFailed}
        onFieldsChange={() => {
          setButtonDisabled(
            Object.values(
              modalForm.getFieldsValue(["name", "subdomain", "licensing"])
            ).some((field: any) => field.length === 0) ||
              modalForm
                .getFieldsError()
                .some((field: any) => field.errors.length > 0)
          );
        }}
        size="small"
        labelAlign="left"
        labelWrap
        layout="vertical"
        initialValues={{
          name,
          subdomain,
          id,
          createDate,
          licensing,
        }}
      >
        <div className={clsx("tenant")}>
          <Item label={t("name")} name="name" rules={[{ required: true }]}>
            <Input placeholder={t("placeholder.name")} />
          </Item>

          <Item
            label={t("subdomain")}
            name="subdomain"
            rules={[{ required: true }]}
          >
            <Input placeholder={t("placeholder.subdomain")} />
          </Item>

          <Item name="id" hidden>
            <Input hidden />
          </Item>

          <Item
            label={t("createDate")}
            name="createDate"
            rules={[{ required: false }]}
          >
            <Input placeholder={t("placeholder.createDate")} />
          </Item>

          <Item
            label={t("usersAllowed")}
            name="usersAllowed"
            rules={[{ required: false }]}
          >
            <Input placeholder={t("placeholder.usersAllowed")} />
          </Item>
        </div>
      </Form>
    </Spin>
  );
}

export default Tenant;

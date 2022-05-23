import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Form, FormInstance, Input, message, Select, Spin, Switch } from "antd";
import { useTranslation } from "react-i18next";
import { Option } from "antd/es/mentions";
import { AgencyData } from "../../types/agency";
import getAgencyByTenantData from "../../api/agency/getAgencyByTenantData";
import removeEmbedded from "../../utils/removeEmbedded";

const { TextArea } = Input;
const { Item } = Form;

export const defaultAgency: AgencyData = {
  name: "",
  city: "",
  consultingType: "",
  description: "",
  offline: false,
  postcode: "",
  teamAgency: true,
  id: null,
  url: null,
};

export interface Props {
  formData: AgencyData;
  isInAddMode?: boolean;
  modalForm: FormInstance;
  handleEditAgency?: (arg0: AgencyData) => void;
  setButtonDisabled: Dispatch<SetStateAction<boolean>>;
}

function Agency({
  formData,
  isInAddMode = false,
  modalForm,
  handleEditAgency,
  setButtonDisabled,
}: Props) {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState(isInAddMode);

  useEffect(() => {
    modalForm.resetFields();
  }, [formData, modalForm]);

  const {
    name,
    city,
    consultingType,
    description,
    offline,
    postcode,
    teamAgency,
  } = formData;

  const onFormSubmit = (values: any) => {
    setEditing(!editing);
    if (handleEditAgency) {
      handleEditAgency(values);
    }
  };

  const onFinishFailed = () => {
    message.error({
      content: t("message.error.default"),
      duration: 3,
    });
  };

  useEffect(() => {
    setIsLoading(true);
    getAgencyByTenantData()
      .then((result: any) => {
        // eslint-disable-next-line no-underscore-dangle
        const resultNormalized = removeEmbedded(result).data;
        modalForm.setFieldsValue({ agency: resultNormalized[0].id });
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [t, modalForm]);

  return (
    <Form
      form={modalForm}
      onFinish={onFormSubmit}
      onFinishFailed={onFinishFailed}
      onFieldsChange={() => {
        setButtonDisabled(
          Object.values(
            modalForm.getFieldsValue(["name", "city", "postcode"])
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
      initialValues={{ name, description, city, postcode, offline, teamAgency }}
    >
      <Item label={t("agency.name")} name="name" rules={[{ required: true }]}>
        <Input placeholder={t("placeholder.agency.name")} maxLength={100} />
      </Item>
      <Item
        label={t("agency.description")}
        name="description"
        rules={[{ required: false }]}
      >
        <TextArea placeholder={t("placeholder.agency.description")} />
      </Item>
      <Item label={t("agency.teamAgency")} name="teamAgency">
        <Select placeholder={t("plsSelect")}>
          <Option key="0" value="true">
            {t("yes")}
          </Option>
          <Option key="1" value="false">
            {t("no")}
          </Option>
        </Select>
      </Item>
      <Item label={t("agency.city")} name="city" rules={[{ required: true }]}>
        <Input placeholder={t("placeholder.agency.city")} maxLength={100} />
      </Item>
      <Item label={t("agency.postcode")} name="postcode">
        <Input placeholder={t("placeholder.agency.postcode")} maxLength={5} />
      </Item>
      {/* <div style={{ display: "flex", justifyContent: "space-between" }}> */}
      {/*  <Item */}
      {/*    style={{ width: "40%" }} */}
      {/*    label={t("agency.postcode.from")} */}
      {/*    name="postcodeFrom" */}
      {/*  > */}
      {/*    <Input /> */}
      {/*  </Item> */}
      {/*  <Item */}
      {/*    style={{ width: "40%" }} */}
      {/*    label={t("agency.postcode.to")} */}
      {/*    name="postcodeTo" */}
      {/*  > */}
      {/*    <Input /> */}
      {/*  </Item> */}
      {/* </div> */}
      <Item label={t("agency.offline")} name="offline">
        <Switch defaultChecked={offline} />
      </Item>
    </Form>
  );
}

export default Agency;

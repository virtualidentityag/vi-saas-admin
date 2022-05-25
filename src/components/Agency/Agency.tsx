import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Form, FormInstance, Input, message, Select, Switch } from "antd";
import { useTranslation } from "react-i18next";
import { Option } from "antd/es/mentions";

import { AgencyData } from "../../types/agency";
import getAgencyPostCodeRange, {
  PostCodeRange,
} from "../../api/agency/getAgencyPostCodeRange";
import PostCodeRanges from "./PostCodeRanges";

const { TextArea } = Input;
const { Item } = Form;

export const defaultAgency: AgencyData = {
  id: null,
  name: "",
  city: "",
  consultingType: "",
  description: "",
  offline: true,
  postcode: "",
  teamAgency: "true",
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

  const [editing, setEditing] = useState(isInAddMode);
  const [postCodeRangesActive, setPostCodeRangesActive] = useState(false);
  const [agencyPostCodeRanges, setAgencyPostCodeRanges] = useState(
    [] as PostCodeRange[]
  );

  if (!isInAddMode) {
    setButtonDisabled(false);
  }

  useEffect(() => {
    modalForm.resetFields();
    const agencyId = formData.id;
    if (agencyId) {
      getAgencyPostCodeRange(agencyId).then((data) => {
        setAgencyPostCodeRanges(data);
        if (
          data.length === 1 &&
          data[0].from === "00000" &&
          data[0].until === "99999"
        ) {
          setPostCodeRangesActive(false);
          modalForm.setFieldsValue({ postCodeRangesActive: false });
        } else {
          setPostCodeRangesActive(true);
          modalForm.setFieldsValue({ postCodeRangesActive: true });
        }
      });
    }
  }, [formData, modalForm]);

  const { name, city, description, offline, postcode, teamAgency } = formData;

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
      initialValues={{
        name,
        description,
        city,
        postcode,
        offline,
        teamAgency,
        postCodeRangesActive,
      }}
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
        <Select placeholder={t("plsSelect")} defaultValue>
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
      <Item
        label={t("agency.postcode")}
        name="postcode"
        rules={[{ required: true }]}
      >
        <Input placeholder={t("placeholder.agency.postcode")} maxLength={5} />
      </Item>
      <Item label={t("agency.postCodeRanges")} name="postCodeRangesActive">
        <Switch
          checked={postCodeRangesActive}
          onChange={() => setPostCodeRangesActive(!postCodeRangesActive)}
        />
      </Item>
      {postCodeRangesActive && (
        <PostCodeRanges
          agencyPostCodeRanges={agencyPostCodeRanges}
          formInputData={modalForm}
        />
      )}
      <Item label={t("agency.offline")} name="offline">
        <Switch defaultChecked={offline} />
      </Item>
    </Form>
  );
}

export default Agency;

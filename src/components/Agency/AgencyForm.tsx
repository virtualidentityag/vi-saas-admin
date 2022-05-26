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

export const emptyAgencyModal: AgencyData = {
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
  agencyModel: AgencyData;
  isInAddMode?: boolean;
  formInstance: FormInstance;
  setButtonDisabled: Dispatch<SetStateAction<boolean>>;
}

function hasOnlyDefaultRange(data: PostCodeRange[]) {
  return (
    data.length === 1 && data[0].from === "00000" && data[0].until === "99999"
  );
}

function AgencyForm({
  agencyModel,
  isInAddMode = false,
  formInstance,
  setButtonDisabled,
}: Props) {
  const { t } = useTranslation();

  const [postCodeRangesActive, setPostCodeRangesActive] = useState(false);
  const [agencyPostCodeRanges, setAgencyPostCodeRanges] = useState(
    [] as PostCodeRange[]
  );

  if (!isInAddMode) {
    setButtonDisabled(false);
  }

  const setPostCodeRangesSwitchState = (data: PostCodeRange[]) => {
    if (hasOnlyDefaultRange(data)) {
      setPostCodeRangesActive(false);
      formInstance.setFieldsValue({ postCodeRangesActive: false });
    } else {
      setPostCodeRangesActive(true);
      formInstance.setFieldsValue({ postCodeRangesActive: true });
    }
  };

  useEffect(() => {
    formInstance.resetFields();
    const agencyId = agencyModel.id;
    if (agencyId) {
      getAgencyPostCodeRange(agencyId).then((data) => {
        setAgencyPostCodeRanges(data);
        setPostCodeRangesSwitchState(data);
      });
    }
  }, [agencyModel, formInstance]);

  const { name, city, description, offline, postcode, teamAgency } =
    agencyModel;

  const onFinishFailed = () => {
    message.error({
      content: t("message.error.default"),
      duration: 3,
    });
  };

  return (
    <Form
      form={formInstance}
      onFinishFailed={onFinishFailed}
      onFieldsChange={() => {
        setButtonDisabled(
          Object.values(
            formInstance.getFieldsValue(["name", "city", "postcode"])
          ).some((field: any) => field.length === 0) ||
            formInstance
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
          formInputData={formInstance}
        />
      )}
      <Item label={t("agency.offline")} name="offline">
        <Switch defaultChecked={offline} />
      </Item>
    </Form>
  );
}

export default AgencyForm;

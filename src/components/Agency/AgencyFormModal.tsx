import React, { useEffect, useState } from "react";
import { Form, Input, message, Modal, Select, Switch, Tooltip } from "antd";
import { useTranslation } from "react-i18next";

import Title from "antd/es/typography/Title";
import { AgencyData } from "../../types/agency";
import getAgencyPostCodeRange, {
  PostCodeRange,
} from "../../api/agency/getAgencyPostCodeRange";
import PostCodeRanges from "./PostCodeRanges";
import addAgencyData from "../../api/agency/addAgencyData";
import pubsub, { PubSubEvents } from "../../state/pubsub/PubSub";
import updateAgencyData from "../../api/agency/updateAgencyData";
import hasAgencyConsultants from "../../api/agency/hasAgencyConsultants";
import getTopicByTenantData from "../../api/topic/getTopicByTenantData";

const { Option } = Select;
const { TextArea } = Input;
const { Item } = Form;

function hasOnlyDefaultRangeDefined(data: PostCodeRange[]) {
  return (
    data.length === 1 && data[0].from === "00000" && data[0].until === "99999"
  );
}

function AgencyFormModal() {
  const { t } = useTranslation();
  const [agencyModel, setAgencyModel] = useState<AgencyData | undefined>(
    undefined
  );
  const [formInstance] = Form.useForm();
  const [postCodeRangesSwitchActive, setPostCodeRangesSwitchActive] =
    useState(false);
  const [onlineSwitchDisabled, setOnlineSwitchDisabled] = useState(true);
  const [agencyPostCodeRanges, setAgencyPostCodeRanges] = useState(
    [] as PostCodeRange[]
  );
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [allTopics, setAllTopics] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    pubsub.subscribe(PubSubEvents.AGENCY_UPDATE, (data) => {
      setAgencyModel({ ...data });
      setIsModalVisible(true);
      formInstance.setFieldsValue(data);
      if (data) {
        setSubmitButtonDisabled(data.id === null);
      }
    });
  }, []);

  const setPostCodeRangesSwitchState = (data: PostCodeRange[]) => {
    if (hasOnlyDefaultRangeDefined(data)) {
      setPostCodeRangesSwitchActive(false);
      formInstance.setFieldsValue({ postCodeRangesActive: false });
    } else {
      setPostCodeRangesSwitchActive(true);
      formInstance.setFieldsValue({ postCodeRangesActive: true });
    }
  };

  const agencyId = agencyModel && agencyModel.id;

  useEffect(() => {
    formInstance.resetFields();
    if (agencyId) {
      Promise.all([
        hasAgencyConsultants(agencyId),
        getAgencyPostCodeRange(agencyId),
      ]).then((values) => {
        const hasAgencyConsultantsResponse = values[0];
        setOnlineSwitchDisabled(!hasAgencyConsultantsResponse);
        const agencyPostCodeRangesResponse = values[1];
        setAgencyPostCodeRanges(agencyPostCodeRangesResponse);
        setPostCodeRangesSwitchState(agencyPostCodeRangesResponse);
      });
    }
  }, [t, agencyId, formInstance]);

  const handleAddAction = (formData: Record<string, any>) => {
    setIsModalVisible(false);
    if (agencyModel && agencyModel.id) {
      updateAgencyData(agencyModel, formData as AgencyData).then(() => {
        message.success({
          content: t("message.agency.update"),
          duration: 3,
        });
        pubsub.publishEvent(PubSubEvents.AGENCYLIST_UPDATE, undefined);
      });
    } else {
      addAgencyData(formData).then(() => {
        message.success({
          content: t("message.agency.add"),
          duration: 3,
        });
        pubsub.publishEvent(PubSubEvents.AGENCYLIST_UPDATE, undefined);
      });
    }
  };

  const onFinishFailed = () => {
    message.error({
      content: t("message.error.default"),
      duration: 3,
    });
  };

  const onFieldsChange = () => {
    setSubmitButtonDisabled(
      Object.values(
        formInstance.getFieldsValue(["name", "city", "postcode"])
      ).some((field: any) => field.length === 0) ||
        formInstance
          .getFieldsError()
          .some((field: any) => field.errors.length > 0)
    );
  };

  useEffect(() => {
    setIsLoading(true);
    getTopicByTenantData()
      .then((result: any) => {
        formInstance.setFieldsValue({ topic: result[0].id });
        setAllTopics(result);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setAllTopics([]);
      });
  }, [t, formInstance]);

  if (agencyModel === undefined) {
    return <div />;
  }

  const { online } = agencyModel;

  const renderTopicOptions = (topicItem: Record<string, any>) => (
    <Option key={topicItem.id.toString()} value={topicItem.id.toString()}>
      <span title={`${topicItem.name}`}>{topicItem.name}</span>
    </Option>
  );

  return (
    <Modal
      destroyOnClose
      title={
        <Title level={2}>
          {agencyModel.id
            ? t("agency.modal.headline.edit")
            : t("agency.modal.headline.add")}
        </Title>
      }
      visible={isModalVisible}
      onOk={() => {
        formInstance.validateFields().then((values) => {
          handleAddAction(values);
          setOnlineSwitchDisabled(true);
          setIsModalVisible(false);
          setAgencyModel(undefined);
          setAgencyPostCodeRanges([]);
          setPostCodeRangesSwitchActive(false);
          formInstance.resetFields();
        });
      }}
      onCancel={() => {
        setOnlineSwitchDisabled(true);
        setIsModalVisible(false);
        setAgencyModel(undefined);
        setAgencyPostCodeRanges([]);
        setPostCodeRangesSwitchActive(false);
        formInstance.resetFields();
      }}
      okButtonProps={{
        disabled: submitButtonDisabled,
      }}
    >
      <Form
        form={formInstance}
        onFinishFailed={onFinishFailed}
        onFieldsChange={onFieldsChange}
        size="small"
        labelAlign="left"
        labelWrap
        layout="vertical"
        initialValues={{
          ...agencyModel,
          topicIds: agencyModel.topics.map((topic) => topic.id.toString()),
          postCodeRangesActive: postCodeRangesSwitchActive,
          online,
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
          <Select placeholder={t("plsSelect")}>
            <Select.Option key="0" value="true">
              {t("yes")}
            </Select.Option>
            <Select.Option key="1" value="false">
              {t("no")}
            </Select.Option>
          </Select>
        </Item>
        <Item
          label={t("topics.title")}
          name="topicIds"
          rules={[{ required: false, type: "array" }]}
        >
          <Select
            mode="multiple"
            disabled={isLoading}
            allowClear
            filterOption={(input, option) =>
              option?.props.children?.props.title
                .toLocaleLowerCase()
                .indexOf(input.toLocaleLowerCase()) !== -1
            }
            placeholder={t("plsSelect")}
          >
            {allTopics?.map(renderTopicOptions)}
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
            checked={postCodeRangesSwitchActive}
            onChange={() =>
              setPostCodeRangesSwitchActive(!postCodeRangesSwitchActive)
            }
          />
        </Item>
        {postCodeRangesSwitchActive && (
          <PostCodeRanges
            agencyPostCodeRanges={agencyPostCodeRanges}
            formInputData={formInstance}
          />
        )}
        {onlineSwitchDisabled && (
          <Item label={t("agency.online")} name="online">
            <Tooltip title={t("agency.online.tooltip")}>
              <Switch
                checkedChildren="Ja"
                unCheckedChildren="Nein"
                disabled={onlineSwitchDisabled}
                defaultChecked={online}
                onChange={(value) => {
                  formInstance.setFieldsValue({ online: value });
                }}
              />
            </Tooltip>
          </Item>
        )}
        {!onlineSwitchDisabled && (
          <Item label={t("agency.online")} name="online">
            <Switch
              checkedChildren="Ja"
              unCheckedChildren="Nein"
              disabled={onlineSwitchDisabled}
              defaultChecked={online}
              onChange={(value) => {
                formInstance.setFieldsValue({ online: value });
              }}
            />
          </Item>
        )}
      </Form>
    </Modal>
  );
}

export default AgencyFormModal;

import React, { useEffect, useState } from "react";
import { Form, Input, message, Modal, Select } from "antd";
import { useTranslation } from "react-i18next";

import Title from "antd/es/typography/Title";
import { TopicData } from "../../types/topic";
import addTopicData from "../../api/topic/addTopicData";
import pubsub, { PubSubEvents } from "../../state/pubsub/PubSub";
import updateTopicData from "../../api/topic/updateTopicData";

const { TextArea } = Input;
const { Item } = Form;

function TopicFormModal() {
  const { t } = useTranslation();
  const [topicModel, setTopicModel] = useState<TopicData | undefined>(
    undefined
  );
  const [formInstance] = Form.useForm();
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(true);

  useEffect(() => {
    pubsub.subscribe(PubSubEvents.TOPIC_UPDATE, (data) => {
      setTopicModel({ ...data });
      setIsModalVisible(true);
      formInstance.setFieldsValue(data);
      if (data) {
        setSubmitButtonDisabled(data.id === null);
      }
    });
  }, []);

  const handleAddAction = (formData: Record<string, any>) => {
    setIsModalVisible(false);
    if (topicModel && topicModel.id) {
      updateTopicData(topicModel, formData as TopicData).then(() => {
        message.success({
          content: t("message.topic.update"),
          duration: 3,
        });
        pubsub.publishEvent(PubSubEvents.TOPICLIST_UPDATE, undefined);
      });
    } else {
      addTopicData(formData).then(() => {
        message.success({
          content: t("message.topic.add"),
          duration: 3,
        });
        pubsub.publishEvent(PubSubEvents.TOPICLIST_UPDATE, undefined);
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
        formInstance.getFieldsValue([
          "name",
          "description",
          "internalIdentifier",
        ])
      ).some((field: any) => field && field.length === 0) ||
        formInstance
          .getFieldsError()
          .some((field: any) => field && field.errors.length > 0)
    );
  };

  if (topicModel === undefined) {
    return <div />;
  }

  return (
    <Modal
      destroyOnClose
      title={
        <>
          <Title level={2}>
            {topicModel.id
              ? t("topic.modal.headline.edit")
              : t("topic.modal.headline.add")}
          </Title>
          <small className="requiredFieldsInfo">{t("required.info")}</small>
        </>
      }
      visible={isModalVisible}
      onOk={() => {
        formInstance.validateFields().then((values) => {
          handleAddAction(values);
        });
      }}
      onCancel={() => {
        setIsModalVisible(false);
        setTopicModel(undefined);
        formInstance.resetFields();
      }}
      okButtonProps={{
        disabled: submitButtonDisabled,
      }}
      okText={t("btn.ok.uppercase")}
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
          ...topicModel,
        }}
      >
        <Item
          label={t("topic.name")}
          name="name"
          rules={[{ required: true, max: 100 }]}
        >
          <Input placeholder={t("placeholder.topic.name")} maxLength={100} />
        </Item>
        <Item
          label={t("topic.description")}
          name="description"
          rules={[{ required: true, max: 200 }]}
        >
          <TextArea placeholder={t("placeholder.topic.description")} />
        </Item>
        <Item
          label={t("topic.internalIdentifier")}
          name="internalIdentifier"
          rules={[{ max: 50 }]}
        >
          <Input
            placeholder={t("placeholder.topic.internalIdentifier")}
            maxLength={50}
          />
        </Item>
        <Item label={t("status")} name="status" rules={[{ required: true }]}>
          <Select placeholder={t("plsSelect")}>
            <Select.Option key="0" value="ACTIVE">
              {t("status.ACTIVE.tooltip")}
            </Select.Option>
            <Select.Option key="1" value="INACTIVE">
              {t("status.INACTIVE.tooltip")}
            </Select.Option>
          </Select>
        </Item>
      </Form>
    </Modal>
  );
}

export default TopicFormModal;

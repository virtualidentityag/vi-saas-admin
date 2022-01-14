import { Button, Card, Divider, Form, Input, message, Upload } from "antd";
import clsx from "clsx";
import { SaveOutlined, UploadOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useTranslation } from "react-i18next";
import ColorSelector from "../ColorSelector/ColorSelector";
import RichTextEditor from "../RichText/RichTextEditor";

import getCancelTokenSource from "../../api/getCancelTokenSource";
import editFAKETenantData from "../../api/tenant/editFAKETenantData";

const { Meta } = Card;

function Settings() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { id, theming, name, subdomain, content, licensing } = useSelector(
    (state: any) => state.tenantData
  );
  const dispatch = useDispatch();
  const { logo, favicon, primaryColor, secondaryColor } = theming;
  const { impressum, claim } = content;
  const { allowedNumberOfUsers } = licensing;
  const [isLoading, setIsLoading] = useState(false);

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const onFormSubmit = (values: any) => {
    setIsLoading(true);

    //  ToDo: outsource restructured data into Helper
    const tenantData = {
      id: values.id,
      name: values.name,
      subdomain: values.subdomain,
      updateDate: moment().format(), // ISO format
      licensing: {
        allowedNumberOfUsers: values.allowedNumberOfUsers,
      },
      theming: {
        logo: values.logo,
        favicon: values.favicon,
        primaryColor: values.primaryColor,
        secondaryColor: values.secondaryColor,
      },
      content: {
        impressum: values.impressum.toString("html"),
        claim: values.claim,
      },
    };

    const cancelTokenSource = getCancelTokenSource();
    editFAKETenantData(tenantData, cancelTokenSource)
      .then((response: any) => {
        setIsLoading(false);
        dispatch({
          type: "tenant/set-data",
          payload: response,
        });
        message.success({
          content: `Setting wurden aktualisiert!`,
          duration: 3,
        });
      })
      .catch(() => {
        setIsLoading(false);
        message.error({
          content:
            "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal",
          duration: 3,
        });
      });
    //
  };

  const onFinishFailed = () => {
    message.error({
      content: `Settings wurden NICHT aktualisiert!`,
      duration: 3,
    });
  };

  const setColor = (field: string, color: string) => {
    form.setFieldsValue({ [field]: color });
  };

  const setImprint = (text: any) => {
    form.setFieldsValue({ impressum: text });
  };

  const formFields = (
    <>
      <Form.Item
        label={t("organisation.name")}
        name="name"
        rules={[{ required: true }]}
      >
        <Input disabled={isLoading} />
      </Form.Item>
      <Form.Item
        label={t("organisation.claim")}
        name="claim"
        rules={[{ required: true }]}
      >
        <Input disabled={isLoading} />
      </Form.Item>
      <Form.Item
        label={t("organisation.subdomain")}
        name="subdomain"
        rules={[{ required: true }]}
      >
        <Input disabled={isLoading} />
      </Form.Item>

      <Form.Item
        label={t("organisation.logo")}
        name="logo"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload name="logo" action="/upload.do" listType="picture">
          <Button icon={<UploadOutlined />}>{t("fileUpload")}</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        label={t("organisation.favicon")}
        name="favicon"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload name="favicon" action="/upload.do" listType="picture">
          <Button icon={<UploadOutlined />}>{t("fileUpload")}</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        label={t("organisation.primaryColor")}
        name="primaryColor"
        rules={[{ required: true }]}
      >
        <Input
          disabled={isLoading}
          addonAfter={
            <ColorSelector
              tenantColor={primaryColor}
              setColorValue={setColor}
              field="primaryColor"
            />
          }
        />
      </Form.Item>
      <Form.Item label={t("organisation.secondaryColor")} name="secondaryColor">
        <Input
          disabled={isLoading}
          addonAfter={
            <ColorSelector
              tenantColor={secondaryColor}
              setColorValue={setColor}
              field="secondaryColor"
            />
          }
        />
      </Form.Item>

      <Form.Item
        label={t("imprint")}
        name="impressum"
        rules={[{ required: true }]}
      >
        <RichTextEditor onChange={setImprint} value={impressum} />
      </Form.Item>
      <Divider />

      {/* maybe later when we've are able to change it here
      <Form.Item label={t("allowedNumberOfUsers")} name="allowedNumberOfUsers">
        <Input disabled />
      </Form.Item> */}

      <Form.Item name="id" hidden />
    </>
  );

  return (
    <Form
      form={form}
      name="tenantSettings"
      onFinish={onFormSubmit}
      onFinishFailed={onFinishFailed}
      size="small"
      labelCol={{ span: 3 }}
      wrapperCol={{ span: 6 }}
      labelAlign="left"
      labelWrap
      initialValues={{
        id,
        logo,
        favicon,
        subdomain,
        primaryColor,
        secondaryColor,
        impressum,
        name,
        claim,
        allowedNumberOfUsers,
      }}
    >
      <Card
        className={clsx("")}
        actions={[
          <div />,
          <Button
            htmlType="submit"
            type="primary"
            disabled={isLoading}
            icon={<SaveOutlined />}
          >
            {t("save")}
          </Button>,
        ]}
      >
        <Meta title={t("organisation")} description={formFields} />
      </Card>
    </Form>
  );
}

export default Settings;

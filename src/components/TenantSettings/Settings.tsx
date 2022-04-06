import {
  Button,
  Col,
  Form,
  Input,
  message,
  Popover,
  Row,
  Typography,
} from "antd";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Title from "antd/es/typography/Title";
import ColorSelector from "../ColorSelector/ColorSelector";
import RichTextEditor from "../RichText/RichTextEditor";

// currently we don't have a proper UX concept for this
// import getComplentaryColor from "../../utils/getComplentaryColor";

import CustomInfoIcon from "../CustomIcons/Info";
import editTenantData from "../../api/tenant/editTenantData";
import FileUploader from "../FileUploader/FileUploader";
import decodeHTML from "../../utils/decodeHTML";

const { Item } = Form;
const { Paragraph } = Typography;

function Settings() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { tenantData } = useSelector((state: any) => state);
  const { id, theming, name, subdomain, content, licensing, isSuperAdmin } =
    tenantData;
  const { logo, favicon, primaryColor, secondaryColor } = theming;
  const { impressum, claim, privacy, termsAndConditions } = content;
  const { allowedNumberOfUsers } = licensing;
  const [isLoading, setIsLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>(decodeHTML(logo) || "");
  const [faviconUrl, setFaviconUrl] = useState<string>(
    decodeHTML(favicon) || ""
  );

  /* currently we don't have a proper UX concept for this const
  setComplementaryColor = (color: string) => {
     form.setFieldsValue({ secondaryColor: getComplentaryColor(color) });
   }; */

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const onFormSubmit = (values: any) => {
    setIsLoading(true);

    /* currently we don't have a proper UX concept for this
    if (!values.secondaryColor) {
         setComplementaryColor(values.primaryColor);
      message.success({
        content: t("message.settings.complementaryColor"),
        duration: 3,
      });
    } */

    //  ToDo: outsource restructured data into Helper
    const changedTenantData = {
      id: values.id,
      name: values.name,
      subdomain: "happylife",
      updateDate: moment().format(), // ISO format
      isSuperAdmin,
      licensing: {
        allowedNumberOfUsers: 5,
      },
      theming: {
        logo: logoUrl,
        favicon: faviconUrl,
        primaryColor: values.primaryColor,
        secondaryColor: "",
        /* currently we don't have a proper UX concept for this
         values.secondaryColor || form.getFieldValue("secondaryColor"),
         */
      },
      content: {
        impressum: values.impressum.toString("html"),
        privacy: values.privacy.toString("html"),
        termsAndConditions: values.termsAndConditions.toString("html"),
        claim: values.claim.toString("html"),
      },
    };

    editTenantData(changedTenantData)
      .then(() => {
        setIsLoading(false);
        message.success({
          content: t("message.success.setting.update"),
          duration: 3,
        });
      })
      .catch(() => {
        setIsLoading(false);
      });
    //
  };

  const onFinishFailed = () => {
    message.error({
      content: t("message.error.setting.update"),
      duration: 3,
    });
  };

  const setColor = (field: string, color: string) => {
    form.setFieldsValue({ [field]: color });
  };

  const setRteValue = (type: string, text: any) => {
    form.setFieldsValue({ [type]: text });
  };
  return tenantData.id ? (
    <>
      <Title level={3}>{t("settings.title")}</Title>
      <Paragraph className="mb-l">{t("settings.title.text")}</Paragraph>
      <Form
        form={form}
        name="tenantSettings"
        onFinish={onFormSubmit}
        onFinishFailed={onFinishFailed}
        size="small"
        labelAlign="left"
        labelWrap
        layout="vertical"
        initialValues={{
          id,
          logo,
          favicon,
          subdomain,
          primaryColor,
          secondaryColor,
          impressum,
          termsAndConditions,
          privacy,
          name: decodeHTML(name),
          claim: decodeHTML(claim),
          allowedNumberOfUsers,
        }}
      >
        <Button
          htmlType="submit"
          type="primary"
          size="large"
          className="mb-xl w-200"
        >
          {t("save")}
        </Button>

        <Row gutter={40}>
          <Col xs={12} lg={6}>
            <Title className="formHeadline mb-m" level={4}>
              {t("settings.subhead.personalisation")}
            </Title>
            <Item
              label={
                <>
                  <Popover
                    placement="bottomRight"
                    content={t("settings.name.help")}
                    title={t("notice")}
                    trigger="hover"
                  >
                    <CustomInfoIcon />
                  </Popover>
                  <Title level={5}>
                    {t("settings.name") + t("and") + t("organisation.claim")}
                  </Title>
                </>
              }
              className="mb-xl"
            >
              <Paragraph className="mb-l desc">
                {t("settings.name.howto")}
              </Paragraph>
              <Item
                label={t("organisation.name")}
                name="name"
                rules={[{ required: true }]}
              >
                <Input disabled={isLoading} placeholder={t("slogan")} />
              </Item>
              <Item
                label={t("organisation.claim")}
                name="claim"
                rules={[{ required: true }]}
              >
                <Input disabled={isLoading} placeholder={t("subSlogan")} />
              </Item>
            </Item>
            <Title className="formHeadline mb-m" level={4}>
              {t("settings.subhead.legal")}
            </Title>
            <Item
              label={<Title level={5}>{t("imprint")}</Title>}
              rules={[{ required: true }]}
              className="mb-xl"
            >
              <Item name="impressum">
                <RichTextEditor
                  onChange={(text: any) => setRteValue("impressum", text)}
                  value={impressum}
                  placeholder={t("settings.imprint.placeholder")}
                />
              </Item>
            </Item>
            <Item
              label={<Title level={5}>{t("privacy")}</Title>}
              rules={[{ required: true }]}
              className="mb-xl"
            >
              <Item name="privacy">
                <RichTextEditor
                  onChange={(text: any) => setRteValue("privacy", text)}
                  value={privacy}
                  placeholder={t("settings.privacy.placeholder")}
                />
              </Item>
            </Item>
            <Item
              label={<Title level={5}>{t("termsAndConditions")}</Title>}
              rules={[{ required: true }]}
              className="mb-2xl"
            >
              <Item name="termsAndConditions">
                <RichTextEditor
                  onChange={(text: any) =>
                    setRteValue("termsAndConditions", text)
                  }
                  value={termsAndConditions}
                  placeholder={t("settings.termsAndConditions.placeholder")}
                />
              </Item>
            </Item>
          </Col>
          <Col xs={12} lg={6}>
            <Title className="formHeadline mb-m" level={4}>
              {t("settings.subhead.view")}
            </Title>
            <Item
              label={
                <>
                  <Popover
                    placement="bottomRight"
                    content={t("settings.images.help")}
                    title={t("notice")}
                    trigger="hover"
                  >
                    <CustomInfoIcon />
                  </Popover>
                  <Title level={5}>
                    {t("organisation.logo") +
                      t("and") +
                      t("organisation.favicon")}
                  </Title>
                </>
              }
              className="mb-xl"
            >
              <Row>
                <Col>
                  <Paragraph className="mb-l desc">
                    {t("settings.images.howto")}
                  </Paragraph>
                </Col>
              </Row>
              <Row gutter={15}>
                <Col xs={6} md={5} lg={4}>
                  <FileUploader
                    name="logo"
                    label={t("organisation.logo")}
                    getValueFromEvent={normFile}
                    imageUrl={logoUrl}
                    setImageUrl={setLogoUrl}
                  />
                </Col>
                <Col xs={6} md={5} lg={4}>
                  <FileUploader
                    name="favicon"
                    label={t("organisation.favicon")}
                    getValueFromEvent={normFile}
                    imageUrl={faviconUrl}
                    setImageUrl={setFaviconUrl}
                  />
                </Col>
              </Row>
            </Item>
            <Item label={<Title level={5}>{t("settings.colors")}</Title>}>
              <Paragraph className="mb-m desc">
                {t("settings.colors.howto")}
              </Paragraph>
              <Row gutter={15}>
                <Col xs={12} md={11} lg={8} xl={6} xxl={5}>
                  <Item
                    shouldUpdate
                    name="primaryColor"
                    rules={[{ required: true }]}
                  >
                    <ColorSelector
                      isLoading={isLoading}
                      label={t("organisation.primaryColor")}
                      tenantColor={primaryColor}
                      setColorValue={setColor}
                      field="primaryColor"
                    />
                  </Item>
                </Col>
                {/* currently we don't have a proper UX concept for this
                  <Col xs={12} md={11} lg={8} xl={6} xxl={5}>
                  <Item shouldUpdate name="secondaryColor">
                    <ColorSelector
                      isLoading={isLoading}
                      label={t("organisation.secondaryColor")}
                      tenantColor={secondaryColor}
                      setColorValue={setColor}
                      field="secondaryColor"
                    />
                  </Item>
                </Col> */}
              </Row>
            </Item>
          </Col>
        </Row>
        <Item name="id" hidden>
          <Input type="hidden" />
        </Item>
      </Form>
    </>
  ) : (
    <div />
  );
}

export default Settings;

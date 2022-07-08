import { Col, Form, Input, Row, Switch, Typography } from "antd";
import Title from "antd/es/typography/Title";
import TextArea from "antd/lib/input/TextArea";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { Box } from "../box/Box";
import { SelectFormField } from "../SelectFormField";
import { ReactComponent as Pencil } from "../../resources/img/svg/pencil.svg";

const { Paragraph } = Typography;
const { Item } = Form;

export default function AgencieEditAllgemeines() {
  const { t } = useTranslation();
  const [formAgencyEdit] = Form.useForm();

  return (
    <Form
      form={formAgencyEdit}
      name="agencyEditGeneralInformation"
      size="small"
      labelAlign="left"
      labelWrap
      layout="vertical"
    >
      <Row gutter={[20, 10]}>
        <Col xs={12} lg={6}>
          <Box>
            <div className="agencyEdit__headline">
              <Title className="formHeadline mb-m" level={4}>
                {t("agency.edit.allgemeines.general_information")}
              </Title>
              <Pencil />
            </div>
            <div className={clsx("agency")}>
              <Item
                label={t("agency.edit.allgemeines.general_information.name")}
                name="Name"
                rules={[{ required: true }]}
              >
                <Input
                  placeholder={t(
                    "agency.edit.allgemeines.general_information.name"
                  )}
                />
              </Item>
              <Item
                label={t(
                  "agency.edit.allgemeines.general_information.description"
                )}
                name="description"
              >
                <TextArea
                  placeholder={t(
                    "agency.edit.allgemeines.general_information.description"
                  )}
                  rows={3}
                />
              </Item>
            </div>
          </Box>
        </Col>
        <Col xs={12} lg={6}>
          <Box>
            <div className="agencyEdit__headline">
              <Title className="formHeadline mb-m" level={4}>
                {t("agency.edit.allgemeines.more_settings")}
              </Title>
              <Pencil />
            </div>
            <div className={clsx("agency")}>
              <SelectFormField
                label="topics.title"
                name="topicIds"
                isMulti
                allowClear
                placeholder="plsSelect"
                options={[
                  { label: "Alkohol", value: "Alkohol" },
                  { label: "Gewinnspiel", value: "Gewinnspiel" },
                  { label: "Schmerzmittel", value: "Schmerzmittel" },
                ]}
              />
              <Row gutter={[20, 10]}>
                <Col xs={12} lg={6}>
                  <Item
                    label={t(
                      "agency.edit.allgemeines.more_settings.team_advice_center"
                    )}
                    name="teamAdviceCenter"
                  >
                    <div className="flex">
                      <Switch
                        size="default"
                        defaultChecked={false}
                        onChange={(value) => {
                          console.log(value);
                        }}
                      />
                      <Paragraph className="desc__toggleText">
                        {t("yes")}
                      </Paragraph>
                    </div>
                  </Item>
                </Col>
                <Col xs={12} lg={6}>
                  <Item
                    label={t("agency.edit.allgemeines.more_settings.online")}
                    name="Online"
                  >
                    <div className="flex">
                      <Switch
                        size="default"
                        defaultChecked={false}
                        onChange={(value) => {
                          console.log(value);
                        }}
                      />
                      <Paragraph className="desc__toggleText">
                        {t("yes")}
                      </Paragraph>
                    </div>
                  </Item>
                </Col>
              </Row>
            </div>
          </Box>
        </Col>
        <Col xs={12} lg={6}>
          <Box>
            <Title className="formHeadline mb-m" level={4}>
              {t("agency.edit.allgemeines.address")}
            </Title>
            <div className="agencyEdit__headline">
              <Title className="formHeadline mb-m" level={4}>
                {t("agency.edit.allgemeines.general_information")}
              </Title>
              <Pencil />
            </div>
            <div className={clsx("agency")}>
              <Row gutter={[20, 10]}>
                <Col xs={12} lg={6}>
                  <Item
                    label={t("agency.edit.allgemeines.address.postcode")}
                    name="Postcode"
                  >
                    <Input
                      placeholder={t(
                        "agency.edit.allgemeines.address.postcode"
                      )}
                      maxLength={5}
                    />
                  </Item>
                </Col>
                <Col xs={12} lg={6}>
                  <Item
                    label={t("agency.edit.allgemeines.address.city")}
                    name="City"
                  >
                    <Input
                      placeholder={t("agency.edit.allgemeines.address.city")}
                    />
                  </Item>
                </Col>
              </Row>

              <Item
                label={t(
                  "agency.edit.allgemeines.general_information.zip_code_scope"
                )}
                name="zipCodeScope"
              >
                <div className="flex">
                  <Switch
                    size="default"
                    defaultChecked={false}
                    onChange={(value) => {
                      console.log(value);
                    }}
                  />
                  <Paragraph className="desc__toggleText">{t("yes")}</Paragraph>
                </div>
              </Item>
            </div>
          </Box>
        </Col>
      </Row>
    </Form>
  );
}

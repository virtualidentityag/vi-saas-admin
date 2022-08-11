import { useEffect, useState } from "react";
import { Col, Form, Input, message, Row, Switch, Typography } from "antd";
import Title from "antd/es/typography/Title";
import TextArea from "antd/lib/input/TextArea";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Box } from "../box/Box";
import { SelectFormField } from "../SelectFormField";
import PostCodeRanges from "./PostCodeRanges";
import { FeatureFlag } from "../../enums/FeatureFlag";
import { Gender } from "../../enums/Gender";
import { SliderFormField } from "../SliderFormField";
import { useFeatureContext } from "../../context/FeatureContext";
import { Button, ButtonItem, BUTTON_TYPES } from "../button/Button";
import addAgencyData from "../../api/agency/addAgencyData";
import pubsub, { PubSubEvents } from "../../state/pubsub/PubSub";
import routePathNames from "../../appConfig";

const { Paragraph } = Typography;
const { Item } = Form;
const DEFAULT_MIN_AGE = 18;
const DEFAULT_MAX_AGE = 100;

export default function AgencieAddAllgemeines() {
  const { t } = useTranslation();
  const { isEnabled } = useFeatureContext();
  const [formAgencyAdd] = Form.useForm();
  const [postCodeRangesSwitchActive, setPostCodeRangesSwitchActive] =
    useState(false);
  const [isTeamAgency, setIsTeamAgency] = useState<boolean>();
  const navigate = useNavigate();
  const [stickyActions, setStickyActions] = useState<boolean>();
  const [stickyActionsPositionBottom, setStickyActionsPositionBottom] =
    useState<number>(0);
  const footerElement = document.querySelector("footer");

  const elementPXSeen = (element: HTMLElement) => {
    const viewportHeight = window?.innerHeight;
    const scrollTop = window?.scrollY;
    const elementOffsetTop = element?.offsetTop;
    const distance = scrollTop + viewportHeight - elementOffsetTop;
    return distance;
  };

  const isElementVisible = (element: HTMLElement) => {
    const rect = element?.getBoundingClientRect();
    const elemTop = rect?.top;
    const elemBottom = rect?.bottom;
    const isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    if (isVisible) {
      setStickyActionsPositionBottom(elementPXSeen(footerElement));
    } else {
      setStickyActionsPositionBottom(0);
    }
  };

  const handleResize = () => {
    const contentHeight = document.querySelector(".content")?.clientHeight;
    const headerHeight = document.querySelector(".siteHeader")?.clientHeight;
    if (window.innerHeight < contentHeight + headerHeight) {
      setStickyActions(true);
    } else {
      setStickyActions(false);
    }
    isElementVisible(footerElement);
  };

  const demographicsInitialValues = isEnabled(FeatureFlag.Demographics)
    ? {
        demographics: {
          age: [DEFAULT_MIN_AGE, DEFAULT_MAX_AGE],
        },
      }
    : {};

  const onFinish = () => {
    const teamAgency = formAgencyAdd.getFieldValue("teamAgency");
    if (teamAgency === undefined) {
      formAgencyAdd.setFieldsValue({
        teamAgency: true,
      });
    }
    formAgencyAdd.validateFields().then((values) => {
      addAgencyData(values).then((id) => {
        const agencyId = id;
        message.success({
          content: t("message.agency.add"),
          duration: 3,
        });
        navigate(
          `${routePathNames.agencyEditAllgemeines.replace(
            ":id",
            agencyId.toString()
          )}`
        );
        pubsub.publishEvent(PubSubEvents.AGENCYLIST_UPDATE, undefined);
      });
    });
  };

  const onCancel = () => {
    formAgencyAdd.resetFields();
  };

  const saveButton: ButtonItem = {
    label: t("agency.add.allgemeines.save"),
    type: BUTTON_TYPES.PRIMARY,
  };

  const cancelButton: ButtonItem = {
    label: t("agency.add.allgemeines.cancel"),
    type: BUTTON_TYPES.SECONDARY,
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("scroll", handleResize, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleResize);
      window.removeEventListener("resize", handleResize);
    };
  });

  return (
    <div className="addForm">
      <Form
        form={formAgencyAdd}
        name="agencyAddGeneralInformation"
        size="small"
        labelAlign="left"
        labelWrap
        layout="vertical"
        initialValues={{
          ...demographicsInitialValues,
        }}
      >
        <Row gutter={[20, 10]}>
          <Col xs={12} lg={6}>
            <Box>
              <div className="agencyEdit__headline">
                <Title className="formHeadline mb-m" level={4}>
                  {t("agency.add.allgemeines")}
                </Title>
              </div>
              <div>
                <Item
                  label={t("agency.add.allgemeines.name")}
                  name="name"
                  rules={[{ required: true }]}
                >
                  <Input placeholder={t("agency.add.allgemeines.name")} />
                </Item>
                <Item
                  label={t("agency.add.allgemeines.description")}
                  name="description"
                >
                  <TextArea
                    placeholder={t("agency.add.allgemeines.description")}
                    rows={3}
                  />
                </Item>
              </div>
            </Box>
            <Box>
              <div className="agencyEdit__headline">
                <Title className="formHeadline mb-m" level={4}>
                  {t("agency.add.allgemeines.address")}
                </Title>
              </div>
              <div>
                <Row gutter={[20, 10]}>
                  <Col xs={12} lg={6}>
                    <Item
                      label={t("agency.add.allgemeines.address.postcode")}
                      name="postcode"
                      rules={[
                        { required: true },
                        {
                          min: 5,
                          message: t(
                            "agency.add.allgemeines.address.range.error"
                          ),
                        },
                      ]}
                    >
                      <Input
                        placeholder={t(
                          "agency.add.allgemeines.address.postcode"
                        )}
                        minLength={5}
                        maxLength={5}
                      />
                    </Item>
                  </Col>
                  <Col xs={12} lg={6}>
                    <Item
                      label={t("agency.add.allgemeines.address.city")}
                      name="city"
                      rules={[{ required: true }]}
                    >
                      <Input
                        placeholder={t("agency.add.allgemeines.address.city")}
                      />
                    </Item>
                  </Col>
                </Row>

                <Item
                  label={t("agency.add.allgemeines.address.zip_code_scope")}
                  name="postCodeRangesActive"
                >
                  <div className="flex">
                    <Switch
                      size="default"
                      checked={postCodeRangesSwitchActive}
                      onChange={() => {
                        const switchValue = !postCodeRangesSwitchActive;
                        setPostCodeRangesSwitchActive(switchValue);
                        formAgencyAdd.setFieldsValue({
                          postCodeRangesActive: switchValue,
                        });
                        setPostCodeRangesSwitchActive(
                          !postCodeRangesSwitchActive
                        );
                      }}
                    />
                    <Paragraph className="desc__toggleText">
                      {t(
                        "agency.add.allgemeines.address.zip_code_scope.information"
                      )}
                    </Paragraph>
                  </div>
                </Item>
                {postCodeRangesSwitchActive && (
                  <PostCodeRanges
                    agencyPostCodeRanges={[]}
                    formInputData={formAgencyAdd}
                  />
                )}
              </div>
            </Box>
          </Col>
          <Col xs={12} lg={6}>
            <Box>
              <div className="agencyEdit__headline">
                <Title className="formHeadline mb-m" level={4}>
                  {t("agency.add.allgemeines.more_settings")}
                </Title>
              </div>
              <div>
                <Row gutter={[20, 10]}>
                  <Col xs={12} lg={6}>
                    <Item
                      label={t(
                        "agency.add.allgemeines.more_settings.team_advice_center"
                      )}
                      name="teamAgency"
                    >
                      <div className="flex">
                        <Switch
                          size="default"
                          defaultChecked
                          onChange={(value) => {
                            setIsTeamAgency(value);
                            formAgencyAdd.setFieldsValue({
                              teamAgency: value,
                            });
                          }}
                          checked={isTeamAgency}
                        />
                        <Paragraph className="desc__toggleText">
                          {t("yes")}
                        </Paragraph>
                      </div>
                    </Item>
                  </Col>
                  <Col xs={12} lg={6}>
                    <Item
                      label={t("agency.add.allgemeines.more_settings.online")}
                      name="online"
                    >
                      <div className="flex">
                        <Switch size="default" defaultChecked={false} />
                        <Paragraph className="desc__toggleText">
                          {t("yes")}
                        </Paragraph>
                      </div>
                    </Item>
                  </Col>
                </Row>
              </div>
              {isEnabled(FeatureFlag.Demographics) && (
                <>
                  <SliderFormField
                    label={t("agency.age")}
                    name={["demographics", "age"]}
                    min={0}
                    max={100}
                  />
                  <SelectFormField
                    errorMessage={t(
                      "agency.add.allgemeines.gender.errorMessage"
                    )}
                    label="agency.gender"
                    name={["demographics", "genders"]}
                    isMulti
                    options={Object.values(Gender).map((gender) => ({
                      value: gender,
                      label: t(`agency.gender.option.${gender.toLowerCase()}`),
                    }))}
                    required
                  />
                </>
              )}
            </Box>
          </Col>
        </Row>
      </Form>
      <div
        className={`agencyAdd_actions ${
          stickyActions ? "agencyAdd_actions--sticky" : ""
        }`}
        style={{ bottom: `${stickyActionsPositionBottom}px` }}
      >
        <Button item={cancelButton} buttonHandle={onCancel} />
        <Button item={saveButton} buttonHandle={onFinish} />
      </div>
    </div>
  );
}
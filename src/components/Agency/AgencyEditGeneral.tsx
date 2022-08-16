import { useEffect, useState } from "react";
import { Col, Form, Input, message, Row, Switch, Typography } from "antd";
import Title from "antd/es/typography/Title";
import TextArea from "antd/lib/input/TextArea";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { Box } from "../box/Box";
import { SelectFormField } from "../SelectFormField";
import { ReactComponent as Pencil } from "../../resources/img/svg/pencil.svg";
import getAgencyPostCodeRange, {
  PostCodeRange,
} from "../../api/agency/getAgencyPostCodeRange";
import PostCodeRanges from "./PostCodeRanges";
import { convertToOptions } from "../../utils/convertToOptions";
import getTopicByTenantData from "../../api/topic/getTopicByTenantData";
import getAgencyDataById from "../../api/agency/getAgencyById";
import { AgencyData } from "../../types/agency";
import { Button, ButtonItem, BUTTON_TYPES } from "../button/Button";
import updateAgencyData from "../../api/agency/updateAgencyData";
import { FeatureFlag } from "../../enums/FeatureFlag";
import { Gender } from "../../enums/Gender";
import { UserRole } from "../../enums/UserRole";
import { SliderFormField } from "../SliderFormField";
import { useFeatureContext } from "../../context/FeatureContext";
import { useUserRoles } from "../../hooks/useUserRoles.hook";
import { getAgencyConsultants } from "../../api/agency/getAgencyConsultants";

const { Paragraph } = Typography;
const { Item } = Form;
const DEFAULT_MIN_AGE = 18;
const DEFAULT_MAX_AGE = 100;

function hasOnlyDefaultRangeDefined(data: PostCodeRange[]) {
  return (
    data.length === 1 && data[0].from === "00000" && data[0].until === "99999"
  );
}

export default function AgencieEditGeneral() {
  const { t } = useTranslation();
  const { isEnabled } = useFeatureContext();
  const [formAgencyEdit] = Form.useForm();
  const [postCodeRangesSwitchActive, setPostCodeRangesSwitchActive] =
    useState(false);
  const [onlineSwitchActive, setOnlineSwitchActive] = useState<boolean>(false);
  const [agencyPostCodeRanges, setAgencyPostCodeRanges] = useState(
    [] as PostCodeRange[]
  );
  const [agencyId, setAgencyId] = useState<string>(null);
  const [agencyModel, setAgencyModel] = useState<AgencyData | undefined>(
    undefined
  );
  const [allTopics, setAllTopics] = useState<Record<string, any>[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTeamAgency, setIsTeamAgency] = useState<boolean>();
  const [readOnlyName, setReadOnlyName] = useState<boolean>(true);
  const [readOnlyDescription, setReadOnlyDescription] = useState<boolean>(true);
  const [readOnlyTopicIds, setReadOnlyTopicIds] = useState<boolean>(true);
  const [readOnlyOnline, setReadOnlyOnline] = useState<boolean>(true);
  const [readOnlyTeamAgency, setReadOnlyTeamAgency] = useState<boolean>(true);
  const [readOnlyPostCodeRanges, setReadOnlyPostCodeRanges] =
    useState<boolean>(true);
  const [readOnlyPostCode, setReadOnlyPostCode] = useState<boolean>(true);
  const [readOnlyCity, setReadOnlyCity] = useState<boolean>(true);
  const [readOnlyAgencyGender, setReadOnlyAgencyGender] =
    useState<boolean>(true);
  const [readOnlyAgencyAge, setReadOnlyAgencyAge] = useState<boolean>(true);
  const [agencyHasConsultants, setAgencyHasConsultants] =
    useState<boolean>(true);
  const currentPath = useLocation().pathname;
  const [, agencyID] = currentPath.match(/.*\/([^/]+)\/[^/]+/);
  const [, hasRole] = useUserRoles();

  const demographicsInitialValues = isEnabled(FeatureFlag.Demographics)
    ? {
        demographics: {
          age: agencyModel?.demographics?.ageFrom
            ? [agencyModel.demographics.ageFrom, agencyModel.demographics.ageTo]
            : [DEFAULT_MIN_AGE, DEFAULT_MAX_AGE],
          genders: agencyModel?.id
            ? agencyModel?.demographics?.genders
            : Object.values(Gender),
        },
      }
    : {};

  const setPostCodeRangesSwitchState = (data: PostCodeRange[]) => {
    if (hasOnlyDefaultRangeDefined(data)) {
      setPostCodeRangesSwitchActive(false);
      formAgencyEdit.setFieldsValue({ postCodeRangesActive: false });
    } else {
      setPostCodeRangesSwitchActive(true);
      formAgencyEdit.setFieldsValue({ postCodeRangesActive: true });
    }
  };

  const resetGeneralInformation = () => {
    setReadOnlyName(true);
    setReadOnlyDescription(true);
  };

  const resetMoreSettings = () => {
    setReadOnlyTopicIds(true);
    setReadOnlyOnline(true);
    setReadOnlyTeamAgency(true);
    setReadOnlyAgencyGender(true);
    setReadOnlyAgencyAge(true);
  };

  const resetAddress = () => {
    setReadOnlyPostCodeRanges(true);
    setReadOnlyPostCode(true);
    setReadOnlyCity(true);
  };

  const onFinish = () => {
    formAgencyEdit.validateFields().then((formData) => {
      updateAgencyData(agencyModel, formData as AgencyData).then(() => {
        message.success({
          content: t("message.agency.update"),
          duration: 3,
        });
      });
    });
  };

  const handleGeneralInformation = () => {
    setReadOnlyName(false);
    setReadOnlyDescription(false);
  };

  const resetForm = () => {
    formAgencyEdit.resetFields();
  };

  const handleCancelGeneralInformation = () => {
    resetGeneralInformation();
    resetForm();
  };

  const handleSaveGeneralInformation = () => {
    onFinish();
    resetGeneralInformation();
  };

  const handleMoreSettings = () => {
    setReadOnlyTopicIds(false);
    setReadOnlyOnline(false);
    setReadOnlyTeamAgency(false);
    setReadOnlyAgencyGender(false);
    setReadOnlyAgencyAge(false);
  };

  const handleCancelMoreSettings = () => {
    resetMoreSettings();
    resetForm();
  };

  const handleSaveMoreSettings = () => {
    onFinish();
    resetMoreSettings();
  };

  const handleAddress = () => {
    setReadOnlyPostCodeRanges(false);
    setReadOnlyPostCode(false);
    setReadOnlyCity(false);
  };

  const handleCancelAddress = () => {
    resetAddress();
    resetForm();
  };

  const handleSaveAddress = () => {
    onFinish();
    resetAddress();
  };

  const cancelGeneralInformationEditButton: ButtonItem = {
    label: t("agency.edit.general.general_information.cancel"),
    type: BUTTON_TYPES.LINK,
  };

  const saveGeneralInformationEditButton: ButtonItem = {
    label: t("agency.edit.general.general_information.save"),
    type: BUTTON_TYPES.LINK,
  };

  const cancelMoreSettingsEditButton: ButtonItem = {
    label: t("agency.edit.general.more_settings.cancel"),
    type: BUTTON_TYPES.LINK,
  };

  const saveMoreSettingsEditButton: ButtonItem = {
    label: t("agency.edit.general.more_settings.save"),
    type: BUTTON_TYPES.LINK,
  };

  const cancelAddressEditButton: ButtonItem = {
    label: t("agency.edit.general.address.cancel"),
    type: BUTTON_TYPES.LINK,
  };

  const saveAddressEditButton: ButtonItem = {
    label: t("agency.edit.general.address.save"),
    type: BUTTON_TYPES.LINK,
  };

  useEffect(() => {
    setAgencyId(agencyID);
  }, []);

  useEffect(() => {
    if (agencyId) {
      Promise.all([
        getAgencyPostCodeRange(agencyId),
        getAgencyDataById(agencyId),
        getAgencyConsultants(agencyId),
      ]).then((values) => {
        const agencyPostCodeRangesResponse = values[0];
        /* eslint no-underscore-dangle: ["error", { "allow": ["_embedded"] }] */
        const agencyData = values[1]._embedded;
        setAgencyHasConsultants(values[2].length >= 0);
        setAgencyPostCodeRanges(agencyPostCodeRangesResponse);
        setPostCodeRangesSwitchState(agencyPostCodeRangesResponse);
        setAgencyModel(agencyData);
        setIsTeamAgency(agencyData.teamAgency);
        setOnlineSwitchActive(agencyData.offline);
      });
    }
  }, [agencyId]);

  useEffect(() => {
    setIsLoading(true);
    getTopicByTenantData()
      .then((result: any) => {
        formAgencyEdit.setFieldsValue({ topic: result[0].id });
        const activeTopics = result.filter((topic) => {
          return topic.status === "ACTIVE";
        });
        setAllTopics(activeTopics);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setAllTopics([]);
      });
  }, [t, formAgencyEdit]);

  return (
    <div className="editForm">
      {agencyModel && (
        <Form
          form={formAgencyEdit}
          name="agencyEditGeneralInformation"
          size="small"
          labelAlign="left"
          labelWrap
          layout="vertical"
          initialValues={{
            ...agencyModel,
            ...demographicsInitialValues,
            topicIds: agencyModel?.topics.map((topic) => topic.id.toString()),
            online: !agencyModel.offline,
          }}
        >
          <Row gutter={[20, 10]}>
            <Col xs={12} lg={6}>
              <Box>
                <div className="agencyEdit__headline">
                  <Title className="formHeadline mb-m" level={4}>
                    {t("agency.edit.general.general_information")}
                  </Title>
                  <Pencil
                    className="agencyEdit__pointer"
                    onClick={handleGeneralInformation}
                  />
                </div>
                <div>
                  <Item
                    label={t("agency.edit.general.general_information.name")}
                    name="name"
                    rules={[{ required: true }]}
                  >
                    <Input
                      disabled={readOnlyName}
                      placeholder={t(
                        "agency.edit.general.general_information.name"
                      )}
                    />
                  </Item>
                  <Item
                    label={t(
                      "agency.edit.general.general_information.description"
                    )}
                    name="description"
                  >
                    <TextArea
                      disabled={readOnlyDescription}
                      placeholder={t(
                        "agency.edit.general.general_information.description"
                      )}
                      rows={3}
                    />
                  </Item>
                  {!readOnlyName && !readOnlyDescription && (
                    <div className="agencyEdit__editableButtons">
                      <Button
                        item={cancelGeneralInformationEditButton}
                        buttonHandle={handleCancelGeneralInformation}
                      />
                      <Button
                        item={saveGeneralInformationEditButton}
                        buttonHandle={handleSaveGeneralInformation}
                      />
                    </div>
                  )}
                </div>
              </Box>
              <Box>
                <div className="agencyEdit__headline">
                  <Title className="formHeadline mb-m" level={4}>
                    {t("agency.edit.general.address")}
                  </Title>
                  <Pencil
                    className="agencyEdit__pointer"
                    onClick={handleAddress}
                  />
                </div>
                <div>
                  <Row gutter={[20, 10]}>
                    <Col xs={12} lg={6}>
                      <Item
                        label={t("agency.edit.general.address.postcode")}
                        name="postcode"
                        rules={[{ required: true }]}
                      >
                        <Input
                          disabled={readOnlyPostCode}
                          placeholder={t(
                            "agency.edit.general.address.postcode"
                          )}
                          maxLength={5}
                        />
                      </Item>
                    </Col>
                    <Col xs={12} lg={6}>
                      <Item
                        label={t("agency.edit.general.address.city")}
                        name="city"
                        rules={[{ required: true }]}
                      >
                        <Input
                          disabled={readOnlyCity}
                          placeholder={t("agency.edit.general.address.city")}
                        />
                      </Item>
                    </Col>
                  </Row>

                  <Item
                    label={t("agency.edit.general.address.zip_code_scope")}
                    name="postCodeRangesActive"
                  >
                    <div className="flex">
                      <Switch
                        size="default"
                        checked={postCodeRangesSwitchActive}
                        disabled={readOnlyPostCodeRanges}
                        onChange={() => {
                          const switchValue = !postCodeRangesSwitchActive;
                          setPostCodeRangesSwitchActive(switchValue);
                          formAgencyEdit.setFieldsValue({
                            postCodeRangesActive: switchValue,
                          });
                          setPostCodeRangesSwitchActive(
                            !postCodeRangesSwitchActive
                          );
                        }}
                      />
                      <Paragraph className="desc__toggleText">
                        {t(
                          "agency.edit.general.address.zip_code_scope.information"
                        )}
                      </Paragraph>
                    </div>
                  </Item>
                  {postCodeRangesSwitchActive && (
                    <PostCodeRanges
                      agencyPostCodeRanges={agencyPostCodeRanges}
                      formInputData={formAgencyEdit}
                      disabled={readOnlyPostCodeRanges}
                    />
                  )}
                </div>
                {!readOnlyPostCodeRanges && !readOnlyPostCode && !readOnlyCity && (
                  <div className="agencyEdit__editableButtons">
                    <Button
                      item={cancelAddressEditButton}
                      buttonHandle={handleCancelAddress}
                    />
                    <Button
                      item={saveAddressEditButton}
                      buttonHandle={handleSaveAddress}
                    />
                  </div>
                )}
              </Box>
            </Col>
            <Col xs={12} lg={6}>
              <Box>
                <div className="agencyEdit__headline">
                  <Title className="formHeadline mb-m" level={4}>
                    {t("agency.edit.general.more_settings")}
                  </Title>
                  <Pencil
                    className="agencyEdit__pointer"
                    onClick={handleMoreSettings}
                  />
                </div>
                <div>
                  {hasRole(UserRole.TopicAdmin) &&
                    isEnabled(FeatureFlag.Topics) &&
                    allTopics?.length > 0 && (
                      <Item name="topicIds">
                        <SelectFormField
                          label="topics.title"
                          name="topicIds"
                          isMulti
                          loading={isLoading}
                          allowClear
                          placeholder="plsSelect"
                          options={convertToOptions(allTopics, "name", "id")}
                          disabled={readOnlyTopicIds}
                        />
                      </Item>
                    )}
                  <Row gutter={[20, 10]}>
                    <Col xs={12} lg={6}>
                      <Item
                        label={t(
                          "agency.edit.general.more_settings.team_advice_center"
                        )}
                        name="teamAgency"
                      >
                        <div className="flex">
                          <Switch
                            size="default"
                            disabled={readOnlyTeamAgency}
                            onChange={(value) => {
                              setIsTeamAgency(value);
                              formAgencyEdit.setFieldsValue({
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
                        label={t("agency.edit.general.more_settings.online")}
                        name="online"
                      >
                        <div className="flex">
                          <Switch
                            size="default"
                            checked={!onlineSwitchActive}
                            disabled={
                              readOnlyOnline ||
                              (!readOnlyOnline && !agencyHasConsultants)
                            }
                            onChange={(value: boolean) => {
                              formAgencyEdit.setFieldsValue({
                                online: value,
                              });
                              setOnlineSwitchActive(!value);
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
                {isEnabled(FeatureFlag.Demographics) && (
                  <>
                    <SliderFormField
                      label={t("agency.age")}
                      name={["demographics", "age"]}
                      min={0}
                      max={100}
                      disabled={readOnlyAgencyAge}
                    />
                    <SelectFormField
                      label="agency.gender"
                      name={["demographics", "genders"]}
                      isMulti
                      options={Object.values(Gender).map((gender) => ({
                        value: gender,
                        label: t(
                          `agency.gender.option.${gender.toLowerCase()}`
                        ),
                      }))}
                      disabled={readOnlyAgencyGender}
                    />
                  </>
                )}
                {!readOnlyTopicIds &&
                  !readOnlyOnline &&
                  !readOnlyTeamAgency &&
                  !readOnlyAgencyAge &&
                  !readOnlyAgencyGender && (
                    <div className="agencyEdit__editableButtons">
                      <Button
                        item={cancelMoreSettingsEditButton}
                        buttonHandle={handleCancelMoreSettings}
                      />
                      <Button
                        item={saveMoreSettingsEditButton}
                        buttonHandle={handleSaveMoreSettings}
                      />
                    </div>
                  )}
              </Box>
            </Col>
          </Row>
        </Form>
      )}
    </div>
  );
}
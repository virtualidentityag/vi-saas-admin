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
import getAgencyDataAgencyId from "../../api/agency/getAgencyByAgencieId";
import { AgencyData } from "../../types/agency";
import { Button, ButtonItem, BUTTON_TYPES } from "../button/Button";
import updateAgencyData from "../../api/agency/updateAgencyData";

const { Paragraph } = Typography;
const { Item } = Form;

export default function AgencieEditAllgemeines() {
  const { t } = useTranslation();
  const [formAgencyEdit] = Form.useForm();
  const [postCodeRangesSwitchActive, setPostCodeRangesSwitchActive] =
    useState(false);
  const [agencyPostCodeRanges, setAgencyPostCodeRanges] = useState(
    [] as PostCodeRange[]
  );
  const [agencyId, setAgencyId] = useState<string>(null);
  const [agencyModel, setAgencyModel] = useState<AgencyData | undefined>(
    undefined
  );
  const [allTopics, setAllTopics] = useState<Record<string, any>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [readOnlyName, setReadOnlyName] = useState(true);
  const [readOnlyDescription, setReadOnlyDescription] = useState(true);
  const [readOnlyTopicIds, setReadOnlyTopicIds] = useState(true);
  const [readOnlyOnline, setReadOnlyOnline] = useState(true);
  const [readOnlyTeamAdviceCenter, setReadOnlyTeamAdviceCenter] =
    useState(true);
  const [readOnlyZipCodeScope, setReadOnlyZipCodeScope] = useState(true);
  const [readOnlyPostCode, setReadOnlyPostCode] = useState(true);
  const [readOnlyCity, setReadOnlyCity] = useState(true);
  const currentPath = useLocation().pathname;
  const [, agencyID] = currentPath.match(/.*\/([^/]+)\/[^/]+/);

  const resetGeneralInformation = () => {
    setReadOnlyName(true);
    setReadOnlyDescription(true);
  };

  const resetMoreSettings = () => {
    setReadOnlyTopicIds(true);
    setReadOnlyOnline(true);
    setReadOnlyTeamAdviceCenter(true);
  };

  const resetAddress = () => {
    setReadOnlyZipCodeScope(true);
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
    setReadOnlyTeamAdviceCenter(false);
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
    setReadOnlyZipCodeScope(false);
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
    label: t("agency.edit.allgemeines.general_information.cancel"),
    type: BUTTON_TYPES.LINK,
  };

  const saveGeneralInformationEditButton: ButtonItem = {
    label: t("agency.edit.allgemeines.general_information.save"),
    type: BUTTON_TYPES.LINK,
  };

  const cancelMoreSettingsEditButton: ButtonItem = {
    label: t("agency.edit.allgemeines.more_settings.cancel"),
    type: BUTTON_TYPES.LINK,
  };

  const saveMoreSettingsEditButton: ButtonItem = {
    label: t("agency.edit.allgemeines.more_settings.save"),
    type: BUTTON_TYPES.LINK,
  };

  const cancelAddressEditButton: ButtonItem = {
    label: t("agency.edit.allgemeines.address.cancel"),
    type: BUTTON_TYPES.LINK,
  };

  const saveAddressEditButton: ButtonItem = {
    label: t("agency.edit.allgemeines.address.save"),
    type: BUTTON_TYPES.LINK,
  };

  useEffect(() => {
    setAgencyId(agencyID);
  }, []);

  useEffect(() => {
    if (agencyId) {
      Promise.all([
        getAgencyPostCodeRange(agencyId),
        getAgencyDataAgencyId(agencyId),
      ]).then((values) => {
        const agencyPostCodeRangesResponse = values[0];
        /* eslint no-underscore-dangle: ["error", { "allow": ["_embedded"] }] */
        const agencyData = values[1]._embedded;
        setAgencyPostCodeRanges(agencyPostCodeRangesResponse);
        setAgencyModel(agencyData);
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
            topicIds: agencyModel?.topics.map((topic) => topic.id.toString()),
          }}
        >
          <Row gutter={[20, 10]}>
            <Col xs={12} lg={6}>
              <Box>
                <div className="agencyEdit__headline">
                  <Title className="formHeadline mb-m" level={4}>
                    {t("agency.edit.allgemeines.general_information")}
                  </Title>
                  <Pencil
                    className="agencyEdit__pointer"
                    onClick={handleGeneralInformation}
                  />
                </div>
                <div>
                  <Item
                    label={t(
                      "agency.edit.allgemeines.general_information.name"
                    )}
                    name="name"
                    rules={[{ required: true }]}
                  >
                    <Input
                      disabled={readOnlyName}
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
                      disabled={readOnlyDescription}
                      placeholder={t(
                        "agency.edit.allgemeines.general_information.description"
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
            </Col>
            <Col xs={12} lg={6}>
              <Box>
                <div className="agencyEdit__headline">
                  <Title className="formHeadline mb-m" level={4}>
                    {t("agency.edit.allgemeines.more_settings")}
                  </Title>
                  <Pencil
                    className="agencyEdit__pointer"
                    onClick={handleMoreSettings}
                  />
                </div>
                <div>
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
                            disabled={readOnlyTeamAdviceCenter}
                          />
                          <Paragraph className="desc__toggleText">
                            {t("yes")}
                          </Paragraph>
                        </div>
                      </Item>
                    </Col>
                    <Col xs={12} lg={6}>
                      <Item
                        label={t(
                          "agency.edit.allgemeines.more_settings.online"
                        )}
                        name="online"
                      >
                        <div className="flex">
                          <Switch
                            size="default"
                            defaultChecked={false}
                            disabled={readOnlyOnline}
                          />
                          <Paragraph className="desc__toggleText">
                            {t("yes")}
                          </Paragraph>
                        </div>
                      </Item>
                    </Col>
                  </Row>
                </div>
                {!readOnlyTopicIds &&
                  !readOnlyOnline &&
                  !readOnlyTeamAdviceCenter && (
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
            <Col xs={12} lg={6}>
              <Box>
                <div className="agencyEdit__headline">
                  <Title className="formHeadline mb-m" level={4}>
                    {t("agency.edit.allgemeines.address")}
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
                        label={t("agency.edit.allgemeines.address.postcode")}
                        name="postcode"
                        rules={[{ required: true }]}
                      >
                        <Input
                          disabled={readOnlyPostCode}
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
                        name="city"
                        rules={[{ required: true }]}
                      >
                        <Input
                          disabled={readOnlyCity}
                          placeholder={t(
                            "agency.edit.allgemeines.address.city"
                          )}
                        />
                      </Item>
                    </Col>
                  </Row>

                  <Item
                    label={t("agency.edit.allgemeines.address.zip_code_scope")}
                    name="zipCodeScope"
                  >
                    <div className="flex">
                      <Switch
                        size="default"
                        defaultChecked={false}
                        disabled={readOnlyZipCodeScope}
                        onChange={() =>
                          setPostCodeRangesSwitchActive(
                            !postCodeRangesSwitchActive
                          )
                        }
                      />
                      <Paragraph className="desc__toggleText">
                        {t(
                          "agency.edit.allgemeines.address.zip_code_scope.information"
                        )}
                      </Paragraph>
                    </div>
                  </Item>
                  {postCodeRangesSwitchActive && (
                    <PostCodeRanges
                      agencyPostCodeRanges={agencyPostCodeRanges}
                      formInputData={formAgencyEdit}
                    />
                  )}
                </div>
                {!readOnlyZipCodeScope && !readOnlyPostCode && !readOnlyCity && (
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
          </Row>
        </Form>
      )}
    </div>
  );
}

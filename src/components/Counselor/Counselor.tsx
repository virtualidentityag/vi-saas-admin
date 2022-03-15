import React, { useEffect, useState } from "react";
import { Form, Input, message, FormInstance, Select, Spin } from "antd";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { CounselorData } from "../../types/counselor";
import { decodeUsername } from "../../utils/encryptionHelpers";
import getAgencyByTenantData from "../../api/agency/getAgencyByTenantData";
import removeEmbedded from "../../utils/removeEmbedded";

const { Option } = Select;
const { TextArea } = Input;
const { Item } = Form;

export const defaultCounselor: CounselorData = {
  lastname: "",
  firstname: "",
  email: "",
  active: true,
  gender: "",
  id: "",
  phone: "",
  agency: [],
  username: "",
  key: "",
  formalLanguage: true,
  absent: false,
  absenceMessage: "",
};

export interface Props {
  counselor: CounselorData;
  isInAddMode?: boolean;
  modalForm: FormInstance;
  handleDeleteCounselor?: (arg0: CounselorData) => void;
  handleEditCounselor?: (arg0: CounselorData) => void;
}

function Counselor({
  counselor,
  isInAddMode = false,
  modalForm,
  handleEditCounselor,
}: Props) {
  const { t } = useTranslation();

  const [checkAbsent, setCheckAbsent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [agencies, setAgencies] = useState<Record<string, any>[]>([]);
  const [editing, setEditing] = useState(isInAddMode);

  const onAbsentChange = (value: boolean) => {
    setCheckAbsent(value);
  };

  useEffect(() => {
    modalForm.validateFields(["absenceMessage"]);
  }, [checkAbsent, modalForm]);

  useEffect(() => {
    modalForm.resetFields();
  }, [counselor, modalForm]);

  const {
    lastname,
    firstname,
    email,
    phone,
    active,
    agency,
    username,
    id,
    formalLanguage,
    absent,
    absenceMessage,
  } = counselor;

  const onFormSubmit = (values: any) => {
    setEditing(!editing);
    if (handleEditCounselor) {
      handleEditCounselor(values);
    }
  };

  const onFinishFailed = () => {
    message.error({
      content: t("message.error.default"),
      duration: 3,
    });
  };

  useEffect(() => {
    setIsLoading(true);
    getAgencyByTenantData()
      .then((result: any) => {
        // eslint-disable-next-line no-underscore-dangle
        const resultNormalized = removeEmbedded(result._embedded);
        modalForm.setFieldsValue({ agency: resultNormalized[0].id });
        setAgencies(resultNormalized);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setAgencies([]);
      });
  }, [t, id, modalForm]);

  return (
    <Spin spinning={agencies.length === 0}>
      <Form
        form={modalForm}
        onFinish={onFormSubmit}
        onFinishFailed={onFinishFailed}
        size="small"
        labelAlign="left"
        labelWrap
        layout="vertical"
        initialValues={{
          firstname,
          lastname,
          agency,
          phone,
          email,
          username: decodeUsername(username),
          id,
          formalLanguage,
          absent,
          absenceMessage,
        }}
      >
        <div className={clsx("counselor", !active && "inactive")}>
          <Item
            label={t("firstname")}
            name="firstname"
            rules={[{ required: true }]}
          >
            <Input placeholder={t("placeholder.firstname")} />
          </Item>

          <Item
            label={t("lastname")}
            name="lastname"
            rules={[{ required: true }]}
          >
            <Input placeholder={t("placeholder.lastname")} />
          </Item>

          <Item name="id" hidden>
            <Input hidden />
          </Item>
          <Item label={t("email")} name="email" rules={[{ required: true }]}>
            <Input placeholder={t("placeholder.email")} />
          </Item>
          <Item label={t("agency")} name="agency">
            <Select
              disabled={agencies?.length <= 1 || isLoading}
              placeholder={t("plsSelect")}
            >
              {agencies?.map((agencyItem: Record<string, any>) => (
                <Option key={agencyItem.id} value={agencyItem.id}>
                  {agencyItem.name} ({agencyItem.city})
                </Option>
              ))}
            </Select>
          </Item>
          <Item
            label={t("counselor.username")}
            name="username"
            rules={[{ required: true }]}
          >
            <Input
              placeholder={t("placeholder.username")}
              disabled={!isInAddMode}
            />
          </Item>
          <Item
            label={t("counselor.formalLanguage")}
            name="formalLanguage"
            rules={[{ required: true }]}
          >
            <Select placeholder={t("plsSelect")}>
              <Option key={0} value>
                {t("yes")}
              </Option>
              <Option key={1} value={false}>
                {t("no")}
              </Option>
            </Select>
          </Item>
          {!isInAddMode ? (
            <>
              <Item
                label={t("counselor.absent")}
                name="absent"
                rules={[{ required: true }]}
              >
                <Select placeholder={t("plsSelect")} onChange={onAbsentChange}>
                  <Option key={0} value>
                    {t("yes")}
                  </Option>
                  <Option key={1} value={false}>
                    {t("no")}
                  </Option>
                </Select>
              </Item>

              <Item
                label={t("counselor.absenceMessage")}
                name="absenceMessage"
                rules={[{ required: checkAbsent }]}
              >
                <TextArea rows={3} />
              </Item>
            </>
          ) : (
            <Item name="absent" hidden>
              <Input hidden />
            </Item>
          )}
        </div>
      </Form>
    </Spin>
  );
}

export default Counselor;

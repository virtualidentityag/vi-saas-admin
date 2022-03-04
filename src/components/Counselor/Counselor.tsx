import React, { useEffect, useState } from "react";
import { Form, Input, message, FormInstance, Select } from "antd";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { CounselorData } from "../../types/counselor";
import { decodeUsername } from "../../utils/encryptionHelpers";
import getAgencyByTenantData from "../../api/agency/getAgencyByTenantData";

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
  const [agencies, setAgencies] = useState<Record<string, any>[] | undefined>(
    undefined
  );
  const [editing, setEditing] = useState(isInAddMode);

  const onAbsentChange = (value: boolean) => {
    setCheckAbsent(value);
  };

  useEffect(() => {
    modalForm.validateFields(["absenceMessage"]);
  }, [checkAbsent, modalForm]);

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

  const buildAgencyOptions = () => {
    if (agencies) {
      agencies.map((agencyItem: Record<string, any>) => {
        return (
          <Option key={agencyItem.id}>
            {agencyItem.name} ({agencyItem.city})
          </Option>
        );
      });
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getAgencyByTenantData()
      .then((result: any) => {
        setAgencies(result);
      })
      .catch(() => {
        setIsLoading(false);
        message.error({
          content: t("message.error.default"),
          duration: 3,
        });
      });
  }, [t]);

  return (
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
            disabled={agencies?.length === 1 || isLoading}
            placeholder={t("plsSelect")}
          >
            {buildAgencyOptions}
          </Select>
        </Item>
        <Item
          label={t("counselor.username")}
          name="username"
          rules={[{ required: true }]}
        >
          <Input placeholder={t("placeholder.username")} />
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
  );
}

export default Counselor;

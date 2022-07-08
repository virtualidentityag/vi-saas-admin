import { Form, Input, Modal, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Title from "antd/es/typography/Title";
import TextArea from "antd/lib/input/TextArea";
import { SelectFormField } from "../SelectFormField";

const { Paragraph } = Typography;
const { Item } = Form;

export default function ErstberatungNewModal(props: {
  showEditModal: boolean;
  handleCancel?: (callback: Function) => void;
}) {
  const { t } = useTranslation();
  const [formInstance] = Form.useForm();

  return (
    <Modal
      closable
      title={
        <Title level={4}>
          {t("agency.edit.erstberatung.modal_new_consultation_type.title")}
        </Title>
      }
      visible={props.showEditModal}
      onOk={() => console.log("ok")}
      onCancel={() => {
        props.handleCancel(() => {});
      }}
      destroyOnClose
      cancelText={t(
        "agency.edit.erstberatung.modal_new_consultation_type.cancel"
      )}
      centered
      okText={t("agency.edit.erstberatung.modal_new_consultation_type.ok")}
      className="agencieEditErstberatung"
    >
      <p>{t("agency.edit.erstberatung.modal_new_consultation_type.intro")}</p>
      <Form
        form={formInstance}
        size="small"
        labelAlign="left"
        labelWrap
        layout="vertical"
        initialValues={{
          location: "Videoberatung",
        }}
      >
        <Item
          label={t("agency.edit.erstberatung.modal_new_consultation_type.name")}
          name="name"
          rules={[{ required: true }]}
        >
          <Input
            placeholder={t(
              "agency.edit.erstberatung.modal_new_consultation_type.name.placeholder"
            )}
          />
        </Item>
        <Item
          label={t(
            "agency.edit.erstberatung.modal_new_consultation_type.description"
          )}
          name="description"
        >
          <TextArea
            placeholder={t(
              "agency.edit.erstberatung.modal_new_consultation_type.description.placeholder"
            )}
            rows={3}
          />
        </Item>
        <div className="flex agencieEditErstberatung__minutes">
          <Item
            label={t(
              "agency.edit.erstberatung.modal_new_consultation_type.duration"
            )}
            name="duration"
            rules={[{ required: true }]}
          >
            <Input
              type="number"
              placeholder={t(
                "agency.edit.erstberatung.modal_new_consultation_type.duration.placeholder"
              )}
            />
          </Item>
          <Paragraph className="agencieEditErstberatung__minutes__text">
            {t(
              "agency.edit.erstberatung.modal_new_consultation_type.duration.minutes"
            )}
          </Paragraph>
        </div>
        <SelectFormField
          label="agency.edit.erstberatung.modal_new_consultation_type.advisor"
          name="advisor"
          isMulti
          allowClear
          required
          placeholder="agency.edit.erstberatung.modal_new_consultation_type.advisor"
          options={[
            {
              label: "Beraterin1 Vorname Nachname",
              value: "Beraterin1VornameNachname",
            },
            {
              label: "BerterinMonika Mustermann",
              value: "BerterinMonikaMustermann",
            },
            { label: "Max Mustermann", value: "MaxMustermann" },
          ]}
        />
        <SelectFormField
          disabled
          label="agency.edit.erstberatung.modal_new_consultation_type.location"
          name="location"
          isMulti
          allowClear
          required
          placeholder="agency.edit.erstberatung.modal_new_consultation_type.location"
          options={[
            {
              label: "Videoberatung",
              value: "Videoberatung",
            },
          ]}
        />
      </Form>
    </Modal>
  );
}

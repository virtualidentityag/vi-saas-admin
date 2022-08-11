import { Form, Input, message, Modal, Typography } from "antd";
import { useTranslation } from "react-i18next";
import Title from "antd/es/typography/Title";
import TextArea from "antd/lib/input/TextArea";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { SelectFormField } from "../SelectFormField";
import {
  AgencyEditData,
  AgencyEventTypes,
  ConsultantInterface,
} from "../../types/agencyEdit";
import putConsultantForAgencyEventTypes from "../../api/agency/putConsultantForAgencyEventTypes";

const { Paragraph } = Typography;
const { Item } = Form;

export default function ErstberatungEditModal(props: {
  showEditModal: boolean;
  handleCancel?: (callback: Function) => void;
  handleSave?: (callback: Function) => void;
  editableData: AgencyEditData;
  apiData: AgencyEventTypes[];
}) {
  const { t } = useTranslation();
  const [formInstance] = Form.useForm();
  const currentPath = useLocation().pathname;
  const [, agencyId] = currentPath.match(/.*\/([^/]+)\/[^/]+/);
  const [advisors, setAdvisors] = useState([]);

  useEffect(() => {
    const newConsultants = [];
    props?.apiData[0]?.consultants?.map((consultant: ConsultantInterface) => {
      return newConsultants.push({
        id: consultant.consultantId,
        name: consultant.consultantName,
      });
    });
    setAdvisors(newConsultants);
  }, [props.apiData]);

  return (
    <Modal
      closable
      title={
        <Title level={4}>
          {t("agency.edit.erstberatung.modal_edit_consultation_type.title")}
        </Title>
      }
      visible={props.showEditModal}
      onOk={() => {
        formInstance.validateFields().then((formData) => {
          const consultants = [];
          formData.advisor.forEach((advisor) => {
            let consultant;
            if (advisor.label) {
              consultant = { consultantId: advisor.value };
            } else {
              consultant = {
                consultantId: advisor,
              };
            }
            consultants.push(consultant);
          });
          const updateData = {
            title: formData.name,
            description: formData.description,
            length: parseInt(formData.duration, 10),
            consultants,
          };
          putConsultantForAgencyEventTypes(
            agencyId,
            props.editableData.id,
            updateData
          )
            .then(() => {
              message.success({
                content: t("message.eventType.update"),
                duration: 3,
              });
              props.handleSave(() => {});
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.error(error);
              props.handleSave(() => {});
            });
        });
      }}
      onCancel={() => {
        props.handleCancel(() => {});
      }}
      destroyOnClose
      cancelText={t(
        "agency.edit.erstberatung.modal_edit_consultation_type.cancel"
      )}
      centered
      okText={t("agency.edit.erstberatung.modal_edit_consultation_type.ok")}
      className="agencieEditErstberatung"
    >
      <Form
        form={formInstance}
        size="small"
        labelAlign="left"
        labelWrap
        layout="vertical"
        initialValues={{
          name: props?.editableData?.name,
          description: props?.editableData?.description,
          url: props?.editableData?.url,
          duration: props?.editableData?.duration,
          advisor: props?.editableData?.advisor?.map((advisor) => {
            return {
              label: advisor.name,
              value: advisor.id,
            };
          }),
          location: props?.editableData?.location,
        }}
      >
        <Item
          label={t(
            "agency.edit.erstberatung.modal_edit_consultation_type.name"
          )}
          name="name"
          rules={[{ required: true }]}
        >
          <Input
            placeholder={t(
              "agency.edit.erstberatung.modal_edit_consultation_type.name.placeholder"
            )}
          />
        </Item>
        <Item
          label={t(
            "agency.edit.erstberatung.modal_edit_consultation_type.description"
          )}
          name="description"
        >
          <TextArea
            placeholder={t(
              "agency.edit.erstberatung.modal_edit_consultation_type.description.placeholder"
            )}
            rows={3}
          />
        </Item>
        <div className="agencieEditErstberatung__url">
          <Item
            label={t(
              "agency.edit.erstberatung.modal_edit_consultation_type.url"
            )}
            name="url"
          >
            <Input
              readOnly
              placeholder={t(
                "agency.edit.erstberatung.modal_edit_consultation_type.url.placeholder"
              )}
            />
          </Item>
        </div>
        <div className="flex agencieEditErstberatung__minutes">
          <Item
            label={t(
              "agency.edit.erstberatung.modal_edit_consultation_type.duration"
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
          placeholder="agency.edit.erstberatung.modal_new_consultation_type.advisor"
          options={advisors?.map((advisor) => {
            return {
              label: advisor.name,
              value: advisor.id,
            };
          })}
        />
        <SelectFormField
          disabled
          label="agency.edit.erstberatung.modal_new_consultation_type.location"
          name="location"
          isMulti
          allowClear
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

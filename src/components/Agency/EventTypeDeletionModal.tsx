import { message, Modal } from "antd";
import { useTranslation } from "react-i18next";
import Title from "antd/lib/typography/Title";
import { useLocation } from "react-router";
import { AgencyEditData } from "../../types/agencyEdit";
import deleteConsultantForAgencyEventTypes from "../../api/agency/deleteConsultantForAgencyEventTypes";

export default function EventTypeDeletionModal(props: {
  showDeleteModal: boolean;
  handleCancel?: (callback: Function) => void;
  handleSave?: (callback: Function) => void;
  eventType: AgencyEditData;
}) {
  const { t } = useTranslation();
  const currentPath = useLocation().pathname;
  const [, agencyId] = currentPath.match(/.*\/([^/]+)\/[^/]+/);
  const handleOnDelete = () => {
    deleteConsultantForAgencyEventTypes(agencyId, props.eventType.id)
      .then(() => {
        message.success({
          content: t("message.eventType.delete"),
          duration: 3,
        });
        props.handleSave(() => {});
      })
      .catch(() => {
        props.handleSave(() => {});
      });
  };

  return (
    <Modal
      title={
        <Title level={2}>
          {t("agency.edit.erstberatung.modal_delete_consultation_type.title")}
        </Title>
      }
      visible={props.showDeleteModal}
      onOk={handleOnDelete}
      onCancel={() => {
        props.handleCancel(() => {});
      }}
      cancelText={t("btn.cancel.uppercase")}
      centered
      okText={t("btn.ok.uppercase")}
    >
      <p>
        {t(
          "agency.edit.erstberatung.modal_delete_consultation_type.description"
        )}
      </p>
    </Modal>
  );
}
import React, { useEffect, useState } from "react";
import { message, Modal } from "antd";
import { useTranslation } from "react-i18next";
import Title from "antd/lib/typography/Title";
import pubsub, { PubSubEvents } from "../../state/pubsub/PubSub";
import deleteAgencyData from "../../api/agency/deleteAgencyData";
import { AgencyData } from "../../types/agency";

export default function AgencyDeletionModal() {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [agencyModel, setAgencyModel] = useState<AgencyData | undefined>(
    undefined
  );
  const handleOnDelete = () => {
    if (agencyModel) {
      deleteAgencyData(agencyModel).then(() => {
        setAgencyModel(undefined);
        pubsub.publishEvent(PubSubEvents.AGENCYLIST_UPDATE, undefined);
        message.success({
          content: t("message.agency.delete"),
          duration: 3,
        });
      });
    }
  };

  useEffect(() => {
    pubsub.subscribe(PubSubEvents.AGENCY_DELETE, (data) => {
      setAgencyModel(data);
      setIsModalVisible(true);
    });
  }, []);

  if (agencyModel === undefined) {
    return <div />;
  }

  return (
    <Modal
      title={<Title level={2}>{t("agency.modal.headline.delete")}</Title>}
      visible={isModalVisible}
      onOk={handleOnDelete}
      onCancel={() => {
        setAgencyModel(undefined);
      }}
      cancelText={t("btn.cancel.uppercase")}
      centered
    >
      <p>{t("agency.modal.text.delete")}</p>
    </Modal>
  );
}

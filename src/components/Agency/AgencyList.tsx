import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import Title from "antd/es/typography/Title";
import { Button, message, Modal, Table } from "antd";

import { PlusOutlined } from "@ant-design/icons";
import Agency, { defaultAgency } from "./Agency";
import ModalForm from "../ModalForm/ModalForm";

import EditButtons from "../EditableTable/EditButtons";
import { RenderFormProps } from "../../types/modalForm";
import getAgencyData, {
  DEFAULT_ORDER,
  DEFAULT_SORT,
} from "../../api/agency/getAgencyData";
import { AgencyData } from "../../types/agency";
import addAgencyData from "../../api/agency/addAgencyData";
import editAgencyData from "../../api/agency/editAgencyData";
import deleteAgencyData from "../../api/agency/deleteAgencyData";

function AgencyList() {
  const { t } = useTranslation();
  const [agencies, setAgencies] = useState([]);
  const [numberOfAgencies, setNumberOfAgencies] = useState(0);

  const [tableState, setTableState] = useState({
    current: 1,
    sortBy: DEFAULT_SORT,
    order: DEFAULT_ORDER,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [editingAgency, setEditingAgency] = useState<AgencyData | undefined>(
    undefined
  );

  const [isModalFormVisible, setIsModalFormVisible] = useState(false);
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);

  const resetStatesAfterLoad = () => {
    setIsLoading(false);
    setIsModalFormVisible(false);
    setEditingAgency(undefined);
    setIsModalDeleteVisible(false);
  };

  const handleAddAgency = (formData: Record<string, any>) => {
    setIsLoading(true);
    addAgencyData(formData)
      .then(() => getAgencyData(tableState))
      .then((result: any) => {
        setAgencies(result.data);
        setNumberOfAgencies(result.total);
        setTableState(tableState);
        resetStatesAfterLoad();
        message.success({
          content: t("message.agency.add"),
          duration: 3,
        });
        setIsModalFormVisible(false);
      })
      .catch(() => {});
  };

  const handleEditAgency = (formData: AgencyData, agencyData: AgencyData) => {
    setIsLoading(true);
    editAgencyData(agencyData, formData)
      .then(() => getAgencyData(tableState))
      .then((result: any) => {
        setAgencies(result.data);
        setNumberOfAgencies(result.total);
        resetStatesAfterLoad();
        message.success({
          content: t("message.agency.update"),
          duration: 3,
        });
        setIsLoading(false);
        setIsModalFormVisible(false);
      })
      .catch(() => {
        resetStatesAfterLoad();
      });
  };

  const handleDeleteAgency = (formData: AgencyData) => {
    setIsLoading(true);
    deleteAgencyData(formData)
      .then(() => getAgencyData(tableState))
      .then((result: any) => {
        setAgencies(result.data);
        setTableState(tableState);
        resetStatesAfterLoad();
        message.success({
          content: t("message.agency.delete"),
          duration: 3,
        });
      })
      .catch(() => {
        resetStatesAfterLoad();
      });
  };

  const handleCreateModal = () => {
    setIsModalFormVisible(true);
  };

  const handleFormModalCancel = () => {
    resetStatesAfterLoad();
  };

  const handleOnDelete = () => {
    setIsModalDeleteVisible(false);
    if (editingAgency) {
      handleDeleteAgency(editingAgency);
    }
  };

  const handleDeleteModal = (record: AgencyData | undefined) => {
    setEditingAgency(record as AgencyData);
    setIsModalDeleteVisible(!isModalDeleteVisible);
  };

  const handleEdit = (record: any) => {
    setEditingAgency(record);
    setIsModalFormVisible(true);
  };

  const columns: any[] = [
    {
      title: t("agency.name"),
      dataIndex: "name",
      key: "name",
      sorter: (a: AgencyData, b: AgencyData) => a.name.localeCompare(b.name),
      width: 150,
      ellipsis: true,
      fixed: "left",
      editable: true,
    },
    {
      title: t("agency.description"),
      dataIndex: "description",
      key: "description",
      sorter: (a: AgencyData, b: AgencyData) =>
        a.description.localeCompare(b.description),
      width: 200,
      ellipsis: true,
      fixed: "left",
      editable: true,
    },
    {
      title: t("agency.postcode"),
      dataIndex: "postcode",
      key: "postcode",
      sorter: (a: AgencyData, b: AgencyData) =>
        a.postcode.localeCompare(b.postcode),
      width: 100,
      ellipsis: true,
      fixed: "left",
      editable: true,
    },
    {
      title: t("agency.city"),
      dataIndex: "city",
      key: "city",
      sorter: (a: AgencyData, b: AgencyData) => a.city.localeCompare(b.city),
      width: 100,
      ellipsis: true,
      fixed: "left",
      editable: true,
    },
    {
      title: t("agency.teamAgency"),
      dataIndex: "teamAgency",
      key: "teamAgency",
      sorter: (a: AgencyData, b: AgencyData) => a.teamAgency !== b.teamAgency,
      width: 100,
      ellipsis: true,
      fixed: "left",
      editable: true,
      render: (data: any) => {
        return data === "true" ? "JA" : "NEIN";
      },
    },
    {
      width: 88,
      title: "",
      key: "edit",
      render: (_: any, record: AgencyData) => {
        return (
          <div className="tableActionWrapper">
            <EditButtons
              handleEdit={handleEdit}
              handleDelete={(data) => handleDeleteModal(data as AgencyData)}
              record={record}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    getAgencyData(tableState)
      .then((result: any) => {
        setAgencies(result.data);
        setNumberOfAgencies(result.total);
        resetStatesAfterLoad();
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [t, tableState]);

  const handleTableAction = (pagination: any, filters: any, sorter: any) => {
    if (sorter.field) {
      const sortBy = sorter.field.toUpperCase();
      const order = sorter.order === "descend" ? "DESC" : "ASC";
      setTableState({
        ...tableState,
        current: pagination.current,
        sortBy,
        order,
      });
    } else {
      setTableState({ ...tableState, current: pagination.current });
    }
  };

  const pagination = {
    total: numberOfAgencies,
    current: tableState.current,
    pageSize: 10,
  };

  return (
    <>
      <Title level={3}>{t("agency")}</Title>
      <p>{t("agency.title.text")}</p>

      <Button
        className="mb-m mr-sm"
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleCreateModal}
      >
        {t("new")}
      </Button>

      <Table
        loading={isLoading}
        className="editableTable"
        dataSource={agencies}
        columns={columns}
        scroll={{
          x: "max-content",
          y: "100%",
        }}
        sticky
        tableLayout="fixed"
        onChange={handleTableAction}
        pagination={pagination}
      />

      <Modal
        title={<Title level={2}>{t("agency.modal.headline.delete")}</Title>}
        visible={isModalDeleteVisible}
        onOk={handleOnDelete}
        onCancel={() => handleDeleteModal(editingAgency)}
        cancelText={t("btn.cancel.uppercase")}
        closable={false}
        centered
      >
        <p>{t("agency.modal.text.delete")}</p>
      </Modal>

      <ModalForm
        title={
          editingAgency
            ? t("agency.modal.headline.edit")
            : t("agency.modal.headline.add")
        }
        isInAddMode={!editingAgency}
        isModalCreateVisible={isModalFormVisible}
        handleCreateModalCancel={handleFormModalCancel}
        handleOnAddElement={
          editingAgency
            ? (param) => handleEditAgency(param, editingAgency)
            : handleAddAgency
        }
        formData={editingAgency || defaultAgency}
        renderFormFields={({
          form,
          setButtonDisabled,
          formData,
          isInAddMode,
        }: RenderFormProps) => (
          <Agency
            formData={editingAgency || defaultAgency}
            modalForm={form}
            isInAddMode={isInAddMode}
            setButtonDisabled={setButtonDisabled}
            handleEditAgency={(data) => {
              handleEditAgency(data, formData as AgencyData);
            }}
          />
        )}
      />
    </>
  );
}

export default AgencyList;

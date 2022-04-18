import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import Title from "antd/es/typography/Title";
import { message, Modal, Table } from "antd";

import { useSelector } from "react-redux";
import getCouselorData from "../../api/counselor/getCounselorData";
import { CounselorData } from "../../types/counselor";
import addCouselorData from "../../api/counselor/addCounselorData";
import editCouselorData from "../../api/counselor/editCounselorData";
import deleteCouselorData from "../../api/counselor/deleteCounselorData";
import Counselor, { defaultCounselor } from "./Counselor";
import ModalForm from "../ModalForm/ModalForm";

import EditButtons from "../EditableTable/EditButtons";
import { decodeUsername } from "../../utils/encryptionHelpers";
import addAgencyToCounselor from "../../api/agency/addAgencyToCounselor";
import StatusIcons from "../EditableTable/StatusIcons";
import { Status } from "../../types/status";
import { RenderFormProps } from "../../types/modalForm";
import AddButton from "../EditableTable/AddButton";

function CounselorList() {
  const { t } = useTranslation();
  const [counselors, setCounselors] = useState([]);

  const [tableState, setTableState] = useState({
    current: 1,
    sortBy: "FIRSTNAME",
    order: "ASC",
    numberOfItems: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [editingCounselor, setEditingCounselor] = useState<
    CounselorData | undefined
  >(undefined);

  const { tenantData } = useSelector((state: any) => state);
  const { licensing } = tenantData;
  const { allowedNumberOfUsers } = licensing;

  const [isModalFormVisible, setIsModalFormVisible] = useState(false);
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);

  const resetStatesAfterLoad = () => {
    setIsLoading(false);
    setIsModalFormVisible(false);
    setEditingCounselor(undefined);
    setIsModalDeleteVisible(false);
  };

  const handleAddCounselor = (formData: Record<string, any>) => {
    setIsLoading(true);
    addCouselorData(formData)
      .then((response) => {
        // eslint-disable-next-line no-underscore-dangle
        addAgencyToCounselor(response?._embedded.id, formData.agencyId);
      })
      .then(() => getCouselorData(tableState))
      .then((result: any) => {
        setCounselors(result.data);
        setTableState({ ...tableState, numberOfItems: result.total });
        resetStatesAfterLoad();
        message.success({
          content: t("message.counselor.add"),
          duration: 3,
        });
        setIsModalFormVisible(false);
      })
      .catch(() => {});
  };

  const handleEditCounselor = (
    formData: CounselorData,
    counselorData: CounselorData
  ) => {
    setIsLoading(true);
    editCouselorData(counselorData, formData)
      .then(() => getCouselorData(tableState))
      .then((result: any) => {
        setCounselors(result.data);
        resetStatesAfterLoad();
        message.success({
          content: t("message.counselor.update"),
          duration: 3,
        });
        setIsLoading(false);
        setIsModalFormVisible(false);
      })
      .catch(() => {
        resetStatesAfterLoad();
      });
  };

  const handleDeleteCounselor = (formData: CounselorData) => {
    setIsLoading(true);
    deleteCouselorData(formData)
      .then(() => getCouselorData(tableState))
      .then((result: any) => {
        setCounselors(result.data);
        setTableState({ ...tableState, numberOfItems: result.total });
        resetStatesAfterLoad();
        message.success({
          content: t("message.counselor.delete"),
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
    if (editingCounselor) {
      handleDeleteCounselor(editingCounselor);
    }
  };

  const handleDeleteModal = (record: CounselorData | undefined) => {
    setEditingCounselor(record as CounselorData);
    setIsModalDeleteVisible(!isModalDeleteVisible);
  };

  const handleEdit = (record: any) => {
    const counselorData = record as CounselorData;
    counselorData.agencyId = counselorData.agencies[0].id;
    setEditingCounselor(counselorData);
    setIsModalFormVisible(true);
  };

  const columns: any[] = [
    {
      title: t("firstname"),
      dataIndex: "firstname",
      key: "firstname",
      sorter: (a: CounselorData, b: CounselorData) =>
        a.firstname.localeCompare(b.firstname),
      width: 100,
      ellipsis: true,
      fixed: "left",
      editable: true,
    },
    {
      title: t("lastname"),
      dataIndex: "lastname",
      key: "lastname",
      sorter: (a: CounselorData, b: CounselorData) =>
        a.lastname.localeCompare(b.lastname),
      width: 100,
      ellipsis: true,
      fixed: "left",
      editable: true,
    },

    {
      width: 150,
      title: t("email"),
      dataIndex: "email",
      key: "email",
      ellipsis: true,
      sorter: (a: CounselorData, b: CounselorData) =>
        a.email.localeCompare(b.email),
    },
    {
      width: 150,
      title: t("username"),
      dataIndex: "username",
      key: "username",
      ellipsis: true,
      render: (username: string) => decodeUsername(username),
      sorter: (a: CounselorData, b: CounselorData) =>
        a.username.localeCompare(b.username),
    },
    {
      width: 250,
      title: t("agency"),
      dataIndex: "agencies",
      key: `agencies`,
      ellipsis: true,
      render: (agencies: any[]) =>
        agencies &&
        agencies
          .map((agencyItem) => {
            return agencyItem ? `${agencyItem.name} (${agencyItem.city})` : "";
          })
          .join(),
    },
    {
      width: 80,
      title: t("status"),
      dataIndex: "status",
      key: "status",
      ellipsis: true,
      render: (status: Status) => {
        return <StatusIcons status={status} />;
      },
    },
    {
      width: 88,
      title: "",
      key: "edit",
      render: (_: any, record: CounselorData) => {
        return (
          <div className="tableActionWrapper">
            <EditButtons
              handleEdit={handleEdit}
              handleDelete={(data) => handleDeleteModal(data as CounselorData)}
              record={record}
              isDisabled={record.status === "IN_DELETION"}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    getCouselorData(tableState)
      .then((result: any) => {
        setCounselors(result.data);
        setTableState({ ...tableState, numberOfItems: result.total });
        resetStatesAfterLoad();
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [t, tableState.current, tableState.order, tableState.sortBy]);

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
    total: tableState.numberOfItems,
    current: tableState.current,
    pageSize: 10,
  };

  return (
    <>
      <Title level={3}>{t("counselor.title")}</Title>
      <p>{t("counselor.title.text")}</p>

      <AddButton
        allowedNumberOfUsers={allowedNumberOfUsers}
        sourceLength={tableState.numberOfItems}
        handleBtnAdd={handleCreateModal}
      />

      <Table
        loading={isLoading}
        className="editableTable"
        dataSource={counselors}
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
        title={<Title level={2}>{t("counselor.modal.headline.delete")}</Title>}
        visible={isModalDeleteVisible}
        onOk={handleOnDelete}
        onCancel={() => handleDeleteModal(editingCounselor)}
        cancelText="ABBRECHEN"
        closable={false}
        centered
      >
        <p>{t("counselor.modal.text.delete")}</p>
      </Modal>

      <ModalForm
        title={
          editingCounselor
            ? t("counselor.modal.headline.edit")
            : t("counselor.modal.headline.add")
        }
        isInAddMode={!editingCounselor}
        isModalCreateVisible={isModalFormVisible}
        handleCreateModalCancel={handleFormModalCancel}
        handleOnAddElement={
          editingCounselor
            ? (param) => handleEditCounselor(param, editingCounselor)
            : handleAddCounselor
        }
        formData={editingCounselor || defaultCounselor}
        renderFormFields={({
          form,
          setButtonDisabled,
          formData,
          isInAddMode,
        }: RenderFormProps) => (
          <Counselor
            formData={formData as CounselorData}
            modalForm={form}
            isInAddMode={isInAddMode}
            setButtonDisabled={setButtonDisabled}
          />
        )}
      />
    </>
  );
}

export default CounselorList;

import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import Title from "antd/es/typography/Title";
import { message } from "antd";

import { useSelector } from "react-redux";
import getCouselorData from "../../api/counselor/getCounselorData";
import { CounselorData } from "../../types/counselor";
import addCouselorData from "../../api/counselor/addCounselorData";
import editCouselorData from "../../api/counselor/editCounselorData";
import deleteCouselorData from "../../api/counselor/deleteCounselorData";
import Counselor, { defaultCounselor } from "./Counselor";
import ModalForm from "../ModalForm/ModalForm";

import EditableTable from "../EditableTable/EditableTable";
import EditButtons from "../EditableTable/EditButtons";
import { decodeUsername } from "../../utils/encryptionHelpers";
import addAgencyToCounselor from "../../api/agency/addAgencyToCounselor";
import StatusIcons from "../EditableTable/StatusIcons";
import { Status } from "../../types/status";
import { EditableData } from "../../types/editabletable";
import { RenderFormProps } from "../../types/modalForm";

function CounselorList() {
  const { t } = useTranslation();
  const [counselors, setCounselors] = useState([]);
  const [page, setPage] = useState(1);
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
      .then(() => getCouselorData(page.toString()))
      .then((result: any) => {
        setCounselors(result);
        resetStatesAfterLoad();
        message.success({
          content: t("message.counselor.add"),
          duration: 3,
        });
        setIsModalFormVisible(false);
      })
      .catch(() => {});
  };

  const handleEditCounselor = (formData: CounselorData) => {
    setIsLoading(true);
    editCouselorData(formData)
      .then(() => getCouselorData(page.toString()))
      .then((result: any) => {
        setCounselors(result);
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
      .then(() => getCouselorData(page.toString()))
      .then((result: any) => {
        setCounselors(result);
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

  const handleDeleteModal = (record: EditableData) => {
    setEditingCounselor(record as CounselorData);
    setIsModalDeleteVisible(!isModalDeleteVisible);
  };

  const handleEdit = (record: any) => {
    const counselorData = record as CounselorData;
    counselorData.agencyId = counselorData.agency[0].id;
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
      dataIndex: "agency",
      key: "agency",
      ellipsis: true,
      render: (agency: any[]) =>
        agency &&
        agency
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
              handleDelete={handleDeleteModal}
              record={record}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    getCouselorData(page.toString())
      .then((result: any) => {
        setCounselors(result);
        resetStatesAfterLoad();
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [t, page]);

  return (
    <>
      <Title level={3}>{t("counselor.title")}</Title>
      <p>{t("counselor.title.text")}</p>

      <EditableTable
        handleBtnAdd={handleCreateModal}
        source={counselors}
        isLoading={isLoading}
        columns={columns}
        handleDeleteModalTitle={t("counselor.modal.headline.delete")}
        handleDeleteModalCancel={handleDeleteModal}
        handleDeleteModalText={t("counselor.modal.text.delete")}
        handleOnDelete={handleOnDelete}
        isDeleteModalVisible={isModalDeleteVisible}
        handlePagination={setPage}
        page={page}
        allowedNumberOfUsers={allowedNumberOfUsers}
      />

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
          editingCounselor ? handleEditCounselor : handleAddCounselor
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

import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import Title from "antd/es/typography/Title";
import { message } from "antd";
import getCancelTokenSource from "../../api/getCancelTokenSource";

import getCouselorData from "../../api/counselor/getCounselorData";
import { CounselorData } from "../../types/counselor";
import addCouselorData from "../../api/counselor/addCounselorData";
import editCouselorData from "../../api/counselor/editCounselorData";
import deleteCouselorData from "../../api/counselor/deleteCounselorData";
import { defaultCounselor } from "./Counselor";
import ModalForm from "./ModalForm";

import EditableTable from "../EditableTable/EditableTable";
import rebuildCounselorList from "../../utils/rebuildCounselorList";
import EditButtons from "../EditableTable/EditButtons";

function CounselorList() {
  const { t } = useTranslation();
  const [counselors, setCounselors] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCounselor, setEditingCounselor] = useState<
    CounselorData | undefined
  >(undefined);

  const [isModalFormVisible, setIsModalFormVisible] = useState(false);
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);

  const handleAddCounselor = (formData: CounselorData) => {
    setIsLoading(true);
    addCouselorData(formData)
      .then((result: any) => {
        console.log(result);
        setIsLoading(false);
        setCounselors(result);
        message.success({
          content: t("message.counselor.add"),
          duration: 3,
        });
        setIsModalFormVisible(false);
      })
      .catch(() => {
        setIsLoading(false);
        message.error({
          content: t("message.error.default"),
          duration: 3,
        });
      });
    //
  };

  const handleEditCounselor = (formData: CounselorData) => {
    setIsLoading(true);
    editCouselorData(formData)
      .then((result: any) => {
        setCounselors(result);
        message.success({
          content: t("message.counselor.update"),
          duration: 3,
        });
        setIsLoading(false);
        setIsModalFormVisible(false);
      })
      .catch(() => {
        setIsLoading(false);
        message.error({
          content: t("message.error.default"),
          duration: 3,
        });
      });
    //
  };

  const handleDeleteCounselor = (formData: CounselorData) => {
    setIsLoading(true);
    deleteCouselorData(formData)
      .then((result: any) => {
        setCounselors(result);
        message.success({
          content: t("message.counselor.delete"),
          duration: 3,
        });
        setIsLoading(false);
        setIsModalFormVisible(false);
      })
      .catch(() => {
        setIsLoading(false);
        message.error({
          content: t("message.error.default"),
          duration: 3,
        });
      });
    //
  };

  const handleCreateModal = () => {
    setIsModalFormVisible(true);
  };

  const handleFormModalCancel = () => {
    setEditingCounselor(undefined);
    setIsModalFormVisible(false);
  };

  const handleOnDelete = (values: any) => {
    setIsModalDeleteVisible(false);
    handleDeleteCounselor(values);
  };

  const handleDeleteModal = (record: CounselorData) => {
    setEditingCounselor(record);
    setIsModalDeleteVisible(!isModalDeleteVisible);
  };

  const handleEdit = (record: CounselorData) => {
    setEditingCounselor(record);
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
            return agencyItem
              ? `${agencyItem[0].name} (${agencyItem[0].city})`
              : "";
          })
          .join(),
    },
    {
      width: 88,
      title: "",
      key: "edit",
      render: (_: any, record: CounselorData) => {
        return (
          <EditButtons
            handleEdit={handleEdit}
            handleDelete={handleDeleteModal}
            record={record}
          />
        );
      },
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    getCouselorData(page.toString())
      .then((result) => {
        // eslint-disable-next-line no-underscore-dangle
        return rebuildCounselorList(result._embedded);
      })
      .then((result: any) => {
        console.log("liste consultants", result);
        setCounselors(result);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        message.error({
          content: t("message.error.default"),
          duration: 3,
        });
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
        handleDeleteModalText={t("counselor.modal.delete.text")}
        handleOnDelete={handleOnDelete}
        isDeleteModalVisible={isModalDeleteVisible}
        handlePagination={setPage}
        page={page}
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
        handleOnAddCounselor={
          editingCounselor ? handleEditCounselor : handleAddCounselor
        }
        counselor={editingCounselor || defaultCounselor}
      />
    </>
  );
}

export default CounselorList;

import React, { useEffect, useState } from "react";
import { Form, message } from "antd";

import { useTranslation } from "react-i18next";
import getCancelTokenSource from "../../api/getCancelTokenSource";

import getFAKECouselorData from "../../api/counselor/getFAKECounselorData";
import { CounselorData } from "../../types/counselor";
import addFAKECouselorData from "../../api/counselor/addFAKECounselorData";
import editFAKECouselorData from "../../api/counselor/editFAKECounselorData";
import deleteFAKECouselorData from "../../api/counselor/deleteFAKECounselorData";
import { defaultCounselor } from "./Counselor";
import ModalForm from "./ModalForm";
import EditButtons from "../EditableTable/EditButtons";
import EditableTable from "../EditableTable/EditableTable";

function CounselorList() {
  const { t } = useTranslation();
  const [counselors, setCounselors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record: CounselorData) => record.key === editingKey;
  const [form] = Form.useForm();

  const [isModalCreateVisible, setIsModalCreateVisible] = useState(false);
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);

  const handleAddCounselor = (formData: CounselorData) => {
    setIsLoading(true);
    const cancelTokenSource = getCancelTokenSource();
    addFAKECouselorData(formData, cancelTokenSource)
      .then((result: any) => {
        setIsLoading(false);
        setCounselors(result);
        message.success({
          content: t("counselor.modal.message.add"),
          duration: 3,
        });
        setIsModalCreateVisible(false);
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
    const cancelTokenSource = getCancelTokenSource();
    editFAKECouselorData(formData, counselors, cancelTokenSource)
      .then((result: any) => {
        setIsLoading(false);
        setCounselors(result);
        message.success({
          content: t("counselor.modal.message.update"),
          duration: 3,
        });
        setIsModalCreateVisible(false);
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
    const cancelTokenSource = getCancelTokenSource();
    deleteFAKECouselorData(formData, counselors, cancelTokenSource)
      .then((result: any) => {
        setIsLoading(false);
        setCounselors(result);
        message.success({
          content: t("counselor.modal.message.delete"),
          duration: 3,
        });
        setIsModalCreateVisible(false);
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
    setIsModalCreateVisible(true);
  };

  const handleCreateModalCancel = () => {
    setIsModalCreateVisible(false);
  };

  const handleOnDelete = (values: any) => {
    setIsModalDeleteVisible(false);
    handleDeleteCounselor(values);
  };

  const handleDeleteModal = () => {
    setIsModalDeleteVisible(!isModalDeleteVisible);
  };

  useEffect(() => {
    setIsLoading(true);
    const cancelTokenSource = getCancelTokenSource();
    getFAKECouselorData(cancelTokenSource)
      .then((result: any) => {
        setIsLoading(false);
        setCounselors(result);
      })
      .catch(() => {
        setIsLoading(false);
        message.error({
          content: t("message.error.default"),
          duration: 3,
        });
      });

    return () => {
      cancelTokenSource.cancel();
    };
  }, [t]);

  const edit = (record: CounselorData) => {
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const columns: any[] = [
    {
      title: t("firstName"),
      dataIndex: "firstName",
      key: "firstName",
      sorter: (a: CounselorData, b: CounselorData) =>
        a.firstName.localeCompare(b.firstName),
      width: 100,
      ellipsis: true,
      fixed: "left",
      editable: true,
    },
    {
      title: t("lastName"),
      dataIndex: "lastName",
      key: "lastName",
      sorter: (a: CounselorData, b: CounselorData) =>
        a.lastName.localeCompare(b.lastName),
      width: 100,
      ellipsis: true,
      fixed: "left",
      editable: true,
    },

    {
      width: 250,
      title: t("email"),
      dataIndex: "email",
      key: "email",
      ellipsis: true,
      editable: true,
      sorter: (a: CounselorData, b: CounselorData) =>
        a.email.localeCompare(b.email),
    },
    {
      width: 250,
      title: t("username"),
      dataIndex: "username",
      key: "username",
      ellipsis: true,
      editable: true,
      sorter: (a: CounselorData, b: CounselorData) =>
        a.username.localeCompare(b.username),
    },
    {
      width: 250,
      title: t("agency"),
      dataIndex: "agency",
      key: "agency",
      ellipsis: true,
      editable: true,
      sorter: (a: CounselorData, b: CounselorData) =>
        a.agency.localeCompare(b.agency),
    },
    {
      width: 88,
      title: "",

      key: "edit",
      render: (_: any, record: CounselorData) => {
        const editable = isEditing(record);
        return (
          <EditButtons
            editable={editable}
            handleEdit={handleEditCounselor}
            handleDelete={handleDeleteModal}
            record={record}
            cancel={cancel}
            editingKey={editingKey}
            edit={edit}
          />
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: CounselorData) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      <h2>{t("counselor.title")}</h2>
      <p>{t("counselor.title.text")}</p>
      <EditableTable
        handleBtnAdd={handleCreateModal}
        source={counselors}
        isLoading={isLoading}
        columns={mergedColumns}
        handleDeleteModalTitle={t("counselor.modal.headline.delete")}
        handleDeleteModalCancel={handleDeleteModal}
        handleDeleteModalText={t("counselor.modal.delete.text")}
        handleOnDelete={handleOnDelete}
        isDeleteModalVisible={isModalDeleteVisible}
        form={form}
      />
      <ModalForm
        isModalCreateVisible={isModalCreateVisible}
        handleCreateModalCancel={handleCreateModalCancel}
        handleOnAddCounselor={handleAddCounselor}
        newCounselor={defaultCounselor}
      />
    </>
  );
}

export default CounselorList;

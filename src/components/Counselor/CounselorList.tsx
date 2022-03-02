import React, { useEffect, useState } from "react";
import { Form, message } from "antd";

import { useTranslation } from "react-i18next";
import Title from "antd/es/typography/Title";
import getCancelTokenSource from "../../api/getCancelTokenSource";

import getCouselorData from "../../api/counselor/getCounselorData";
import { CounselorData } from "../../types/counselor";
import addCouselorData from "../../api/counselor/addCounselorData";
import editFAKECouselorData from "../../api/counselor/editFAKECounselorData";
import deleteFAKECouselorData from "../../api/counselor/deleteFAKECounselorData";
import { defaultCounselor } from "./Counselor";
import ModalForm from "./ModalForm";
import EditButtons from "../EditableTable/EditButtons";
import EditableTable from "../EditableTable/EditableTable";
import rebuildCounselorList from "../../utils/rebuildCounselorList";

function CounselorList() {
  const { t } = useTranslation();
  const [counselors, setCounselors] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record: CounselorData) => record.key === editingKey;
  const [form] = Form.useForm();

  const [isModalCreateVisible, setIsModalCreateVisible] = useState(false);
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
          content: t("message.counselor.update"),
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
          content: t("message.counselor.delete"),
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
    getCouselorData(page.toString())
      .then((result) => {
        // eslint-disable-next-line no-underscore-dangle
        return rebuildCounselorList(result._embedded);
      })
      .then((result: any) => {
        setIsLoading(false);
        console.log(result);
        setCounselors(result);
      })
      .catch(() => {
        setIsLoading(false);
        message.error({
          content: t("message.error.default"),
          duration: 3,
        });
      });
  }, [t]);

  const edit = (record: CounselorData) => {
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
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
      <Title level={3}>{t("counselor.title")}</Title>
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
        handlePagination={setPage}
        page={page}
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

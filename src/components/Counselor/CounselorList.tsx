import React, { useEffect, useState } from "react";
import { Table, Button, message, Form } from "antd";

import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import getCancelTokenSource from "../../api/getCancelTokenSource";

import getFAKECouselorData from "../../api/counselor/getFAKECounselorData";
import { CounselorData } from "../../types/counselor";
import addFAKECouselorData from "../../api/counselor/addFAKECounselorData";
import editFAKECouselorData from "../../api/counselor/editFAKECounselorData";
import deleteFAKECouselorData from "../../api/counselor/deleteFAKECounselorData";
import { defaultCounselor } from "./Counselor";
import ModalForm from "./ModalForm";
import EditableTableCell from "../EditableTable/EditableTableCell";
import EditButtons from "../EditableTable/EditButtons";

function CounselorList() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [counselors, setCounselors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record: CounselorData) => record.key === editingKey;

  const [isModalCreateVisible, setIsModalCreateVisible] = useState(false);

  const handleAddCounselor = (formData: CounselorData) => {
    setIsLoading(true);
    const cancelTokenSource = getCancelTokenSource();
    addFAKECouselorData(formData, cancelTokenSource)
      .then((result: any) => {
        setIsLoading(false);
        setCounselors(result);
        message.success({
          content: `Berater ${formData.firstName} ${formData.lastName} wurde aktualisiert!`,
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
          content: `Berater ${formData.firstName} ${formData.lastName} wurde aktualisiert!`,
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
          content: `Berater ${formData.firstName} ${formData.lastName} wurde gelöscht!`,
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
            handleEditCounselor={handleEditCounselor}
            handleDeleteCounselor={handleDeleteCounselor}
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
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleCreateModal}
      >
        {t("new")}
      </Button>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableTableCell,
            },
          }}
          loading={isLoading}
          className="tenantsTable"
          dataSource={counselors}
          columns={mergedColumns}
          scroll={{
            x: "max-content",
            y: "100%",
          }}
          sticky
          tableLayout="fixed"
          // bordered
        />
      </Form>
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

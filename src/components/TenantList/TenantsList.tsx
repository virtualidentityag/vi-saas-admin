import React, { useEffect, useState } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Title from "antd/es/typography/Title";
import { TenantData } from "../../types/tenant";
import getMultipleTenants from "../../api/tenant/getMultipleTenants";
import EditableTable from "../EditableTable/EditableTable";
import ModalForm from "../Counselor/ModalForm";
import { defaultCounselor } from "../Counselor/Counselor";
import EditButtons from "../EditableTable/EditButtons";
import { EditableData } from "../../types/editabletable";
import { RenderFormProps } from "../../types/modalForm";
import Tenant from "./Tenant";

function TenantsList() {
  const { t } = useTranslation();
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTenant, setEditingTenant] = useState<TenantData | undefined>(
    undefined
  );
  const [page, setPage] = useState<number>(1);

  const [isModalFormVisible, setIsModalFormVisible] = useState(false);
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);

  const resetStatesAfterLoad = () => {
    setIsLoading(false);
    setIsModalFormVisible(false);
    setEditingTenant(undefined);
    setIsModalDeleteVisible(false);
  };

  const handleAddTenant = (formData: Record<string, any>) => {
    setIsLoading(true);
    /* addCouselorData(formData)
        .then((response) => {
          // eslint-disable-next-line no-underscore-dangle
          addAgencyToCounselor(response?._embedded.id, formData.agency);
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

     */
  };

  const handleEditTenant = (formData: TenantData) => {
    setIsLoading(true);
    /* editCouselorData(formData)
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
        
     */
  };

  const handleDeleteTenant = (formData: TenantData) => {
    setIsLoading(true);
    /* deleteCouselorData(formData)
      .then(() => getCouselorData(page.toString()))
      .then((result: any) => {
        setTenants(result);
        resetStatesAfterLoad();
        message.success({
          content: t("message.counselor.delete"),
          duration: 3,
        });
      })
      .catch(() => {
        resetStatesAfterLoad();
      });
     
     */
  };

  const handleCreateModal = () => {
    setIsModalFormVisible(true);
  };

  const handleFormModalCancel = () => {
    resetStatesAfterLoad();
  };

  const handleOnDelete = () => {
    setIsModalDeleteVisible(false);
    if (editingTenant) {
      handleDeleteTenant(editingTenant);
    }
  };

  const handleDeleteModal = (record: EditableData) => {
    setEditingTenant(record as TenantData);
    setIsModalDeleteVisible(!isModalDeleteVisible);
  };

  const handleEdit = (record: EditableData) => {
    setEditingTenant(record as TenantData);
    setIsModalFormVisible(true);
  };

  useEffect(() => {
    setIsLoading(true);
    // getFakeMultipleTenants()
    getMultipleTenants(page.toString())
      .then((result: any) => {
        setIsLoading(false);
        setTenants(result);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [t, page]);

  const columns: any[] = [
    {
      title: t("organisation.title"),
      dataIndex: "name",
      key: "name",
      sorter: (a: TenantData, b: TenantData) => a.name.localeCompare(b.name),
      width: 150,
      ellipsis: true,
      fixed: "left",
    },
    {
      width: 250,
      title: t("organisation.subdomain"),
      dataIndex: "subdomain",
      ellipsis: true,
      key: "subdomain",
      /* sorter: (a: TenantData, b: TenantData) =>
        a.subdomain.localeCompare(b.subdomain), */
    },
    {
      title: t("createDate"),
      dataIndex: "createDate",
      key: "createDate",
      ellipsis: true,
      width: 150,
      sorter: (a: TenantData, b: TenantData) =>
        moment(a.createDate).unix() - moment(b.createDate).unix(),
      render: (date: Date) => {
        // convert to german time
        return <span>{date}</span>;
      },
    },
    {
      title: t("organisation.allowedNumberOfUsers"),
      width: 150,
      ellipsis: true,
      render: (record: { licensing: { allowedNumberOfUsers: number } }) =>
        record.licensing.allowedNumberOfUsers,
      /* sorter: (a: TenantData, b: TenantData) =>
        a.licensing.allowedNumberOfUsers - b.licensing.allowedNumberOfUsers, */
    },
    {
      width: 88,
      title: "",
      key: "edit",
      render: (_: any, record: TenantData) => {
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

  return (
    <>
      <Title level={3}>{t("organisations.title")}</Title>
      <p>{t("organisations.title.text")}</p>
      <EditableTable
        handleBtnAdd={handleCreateModal}
        source={tenants}
        isLoading={isLoading}
        columns={columns}
        handleDeleteModalTitle={t("organisation.modal.delete.headline")}
        handleDeleteModalCancel={handleDeleteModal}
        handleDeleteModalText={t("organisation.modal.text.delete")}
        handleOnDelete={handleOnDelete}
        isDeleteModalVisible={isModalDeleteVisible}
        handlePagination={setPage}
        page={page}
        allowedNumberOfUsers={false}
      />
      <ModalForm
        title={
          editingTenant
            ? t("tenant.modal.headline.edit")
            : t("tenant.modal.headline.add")
        }
        isInAddMode={!editingTenant}
        isModalCreateVisible={isModalFormVisible}
        handleCreateModalCancel={handleFormModalCancel}
        handleOnAddElement={editingTenant ? handleEditTenant : handleAddTenant}
        formData={editingTenant || defaultCounselor}
        renderFormFields={({
          form,
          setButtonDisabled,
          formData,
          isInAddMode,
        }: RenderFormProps) => (
          // ToDo: replace with Tenant formData from Tenant.tsx
          <Tenant
            formData={formData as TenantData}
            modalForm={form}
            isInAddMode={isInAddMode}
            setButtonDisabled={setButtonDisabled}
          />
        )}
      />
    </>
  );
}

export default TenantsList;

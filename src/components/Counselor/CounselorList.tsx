import React, { useEffect, useState, useCallback } from "react";
import ReactDOM from "react-dom";

import { useTranslation } from "react-i18next";
import Title from "antd/es/typography/Title";
import { message, Modal, Table } from "antd";

import { useSelector } from "react-redux";
import getCounselorSearchData, {
  DEFAULT_ORDER,
  DEFAULT_PAGESIZE,
  DEFAULT_SORT,
} from "../../api/counselor/getCounselorSearchData";
import { CounselorData } from "../../types/counselor";
import addCouselorData from "../../api/counselor/addCounselorData";
import editCouselorData from "../../api/counselor/editCounselorData";
import deleteCounselorData from "../../api/counselor/deleteCounselorData";
import Counselor, { defaultCounselor } from "./Counselor";
import ModalForm from "../ModalForm/ModalForm";

import EditButtons from "../EditableTable/EditButtons";
import { decodeUsername } from "../../utils/encryptionHelpers";
import StatusIcons from "../EditableTable/StatusIcons";
import { Status } from "../../types/status";
import { RenderFormProps } from "../../types/modalForm";
import AddButton from "../EditableTable/AddButton";
import SearchInput from "../SearchInput/SearchInput";
import CustomChevronDownIcon from "../CustomIcons/ChevronDown";
import CustomChevronUpIcon from "../CustomIcons/ChevronUp";
import putAgenciesForCounselor from "../../api/agency/putAgenciesForCounselor";

enum OpenStatus {
  OPEN,
  CLOSED,
  NOT_AVAILABLE,
}
interface ModifiedCounselorData extends CounselorData {
  openStatus: OpenStatus;
  key: string;
}

function CounselorList() {
  const { t } = useTranslation();
  const [counselors, setCounselors] = useState<ModifiedCounselorData[]>([]);

  const [numberOfCounselors, setNumberOfCounselors] = useState(0);
  const [tableState, setTableState] = useState({
    current: 1,
    sortBy: DEFAULT_SORT,
    order: DEFAULT_ORDER,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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

  const updateCounselors = useCallback((counselorData: CounselorData[]) => {
    const modifiedCounselors = counselorData.map(
      (counselor: CounselorData) => ({
        ...counselor,
        agencies: counselor.agencies.sort((agencyA, agencyB) => {
          if (agencyA.postcode < agencyB.postcode) return -1;
          if (agencyA.postcode > agencyB.postcode) return 1;
          return 0;
        }),
        key: counselor.id,
        openStatus:
          counselor.agencies.length > 1
            ? OpenStatus.CLOSED
            : OpenStatus.NOT_AVAILABLE,
      })
    );
    setCounselors(modifiedCounselors);
  }, []);

  const handleAddCounselor = (formData: Record<string, any>) => {
    setIsLoading(true);
    addCouselorData(formData)
      .then((response) => {
        // eslint-disable-next-line no-underscore-dangle
        putAgenciesForCounselor(response?._embedded.id, formData.agencyIds);
      })
      .then(() => getCounselorSearchData(tableState, searchQuery))
      .then((result: any) => {
        updateCounselors(result.data);
        setTableState(tableState);
        setNumberOfCounselors(result.total);
        resetStatesAfterLoad();
        message.success({
          content: t("message.counselor.add"),
          duration: 3,
        });
        setIsModalFormVisible(false);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
  };

  const handleEditCounselor = (
    formData: CounselorData,
    counselorData: CounselorData
  ) => {
    setIsLoading(true);
    editCouselorData(counselorData, formData)
      .then(() => getCounselorSearchData(tableState, searchQuery))
      .then((result: any) => {
        updateCounselors(result.data);
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
    deleteCounselorData(formData)
      .then(() => getCounselorSearchData(tableState, searchQuery))
      .then((result: any) => {
        updateCounselors(result.data);
        setTableState(tableState);
        setNumberOfCounselors(result.total);
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
    counselorData.agencyIds = counselorData.agencies.map((agency) => agency.id);
    setEditingCounselor(counselorData);
    setIsModalFormVisible(true);
  };

  const handleOnSearch = (value: string) => {
    // React doesn't batch these state hooks since this function is called in a setTimeout function,
    // so we need to manually batch these updates
    ReactDOM.unstable_batchedUpdates(() => {
      setTableState({ ...tableState, current: 1 });
      setSearchQuery(value);
    });
  };

  const handleOnSearchClear = () => {
    setTableState({ ...tableState, current: 1 });
    setSearchQuery("");
  };

  const updateSingleCounselor = (record: ModifiedCounselorData) => {
    setCounselors(
      counselors.map((counselor) => {
        const modifiedCounselor = { ...counselor };

        if (counselor.id === record.id) {
          if (modifiedCounselor.openStatus === OpenStatus.CLOSED) {
            modifiedCounselor.openStatus = OpenStatus.OPEN;
          } else if (modifiedCounselor.openStatus === OpenStatus.OPEN) {
            modifiedCounselor.openStatus = OpenStatus.CLOSED;
          }
        }

        return modifiedCounselor;
      })
    );
  };

  const columns: any[] = [
    {
      title: "",
      dataIndex: "openStatus",
      key: "openStatus",
      width: 50,
      fixed: "left",
      render: (_: any, record: ModifiedCounselorData) => {
        if (record.openStatus === OpenStatus.NOT_AVAILABLE) return null;
        return (
          <button
            className="counselorList__toggle"
            type="button"
            onClick={() =>
              updateSingleCounselor(record as ModifiedCounselorData)
            }
          >
            {record.openStatus === OpenStatus.CLOSED && (
              <CustomChevronDownIcon />
            )}
            {record.openStatus === OpenStatus.OPEN && <CustomChevronUpIcon />}
          </button>
        );
      },
    },
    {
      title: t("firstname"),
      dataIndex: "firstname",
      key: "firstname",
      sorter: (a: CounselorData, b: CounselorData) =>
        a.firstname.localeCompare(b.firstname),
      width: 120,
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
      width: 130,
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
    },
    {
      width: 250,
      title: t("agency"),
      dataIndex: "agencies",
      key: `agencies`,
      ellipsis: true,
      render: (agencies: any[], record: ModifiedCounselorData) => {
        if (agencies) {
          let visibleAgencies = [...agencies];
          if (record.openStatus === OpenStatus.CLOSED) {
            visibleAgencies = [agencies[0]];
          }

          return visibleAgencies.map((agencyItem) => {
            return agencyItem ? (
              <div key={agencyItem.id} className="counselorList__agencies">
                <span>{agencyItem.postcode}</span>
                <span>{agencyItem.name}</span> <span>[{agencyItem.city}]</span>
              </div>
            ) : (
              ""
            );
          });
        }

        return null;
      },
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
    total: numberOfCounselors,
    current: tableState.current,
    pageSize: DEFAULT_PAGESIZE,
  };

  useEffect(() => {
    setIsLoading(true);
    getCounselorSearchData(tableState, searchQuery)
      .then((result: any) => {
        updateCounselors(result.data);
        setNumberOfCounselors(result.total);
        resetStatesAfterLoad();
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [t, tableState, searchQuery, updateCounselors]);

  return (
    <>
      <Title level={3}>{t("counselor.title")}</Title>
      <p>{t("counselor.title.text")}</p>

      <div className="lg-flex justify-between">
        <AddButton
          allowedNumberOfUsers={allowedNumberOfUsers}
          sourceLength={numberOfCounselors}
          handleBtnAdd={handleCreateModal}
        />

        <div className="counselerSearch">
          <SearchInput
            placeholder={t("consultant-search-placeholder")}
            handleOnSearch={handleOnSearch}
            handleOnSearchClear={handleOnSearchClear}
          />
        </div>
      </div>

      <Table
        loading={isLoading}
        className="counselorList editableTable"
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
        cancelText={t("btn.cancel.uppercase")}
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

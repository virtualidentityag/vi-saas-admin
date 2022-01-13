import React, { useEffect, useState } from "react";
import { Card, List, message, Skeleton } from "antd";

import getCancelTokenSource from "../../api/getCancelTokenSource";
import getFAKECouselorData from "../../api/counselor/getFAKECounselorData";
import Counselor, { defaultCounselor } from "./Counselor";
import ModalForm from "./ModalForm";
import ListHeader from "./ListHeader";
import addFAKECouselorData from "../../api/counselor/addFAKECounselorData";
import deleteFAKECouselorData from "../../api/counselor/deleteFAKECounselorData";
import editFAKECouselorData from "../../api/counselor/editFAKECounselorData";
import { CounselorData } from "../../types/counselor";

function CounselorList() {
  const [counselors, setCounselors] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
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
          content:
            "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal",
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
          content:
            "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal",
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
          content:
            "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal",
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
          content:
            "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal",
          duration: 3,
        });
      });

    return () => {
      cancelTokenSource.cancel();
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <List
          key="0"
          className="counselorList"
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 2,
            xl: 3,
            xxl: 3,
          }}
          pagination={{
            pageSize: 6,
          }}
          dataSource={[{}, {}, {}, {}]}
          header={
            <ListHeader
              addHandler={handleCreateModal}
              count={counselors.length}
            />
          }
          renderItem={() => (
            <Card className="counselor">
              <Skeleton loading={isLoading} avatar active />
            </Card>
          )}
        />
      ) : (
        <List
          key="1"
          className="counselorList"
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 2,
            xl: 3,
            xxl: 3,
          }}
          pagination={{
            pageSize: 6,
          }}
          dataSource={counselors}
          header={
            <ListHeader
              addHandler={handleCreateModal}
              count={counselors.length}
            />
          }
          renderItem={(counselor: CounselorData) => (
            <Counselor
              counselor={counselor}
              key={counselor.id}
              handleDeleteCounselor={handleDeleteCounselor}
              handleEditCounselor={handleEditCounselor}
            />
          )}
        />
      )}
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

import { message } from "antd";
import { CounselorData } from "../types/counselor";
import getAgencyByCounselorData from "../api/agency/getAgencyByCounselorData";
import i18n from "../i18n";
import removeEmbedded from "./removeEmbedded";

function rebuildCounselorsList(list: any) {
  const newCounselorsList = removeEmbedded(list).filter(
    (obj: CounselorData) => {
      return obj.deleteDate === "null";
    }
  );

  return newCounselorsList.map((counselor: CounselorData) => {
    const newCounselor = { ...counselor };
    newCounselor.key = counselor.id;
    if (newCounselor.id) {
      newCounselor.key = newCounselor.id;
      getAgencyByCounselorData(counselor.id)
        .then((result: any) => {
          newCounselor.agency = [
            // eslint-disable-next-line no-underscore-dangle
            ...removeEmbedded(removeEmbedded(result)),
          ];
        })
        .catch(() => {
          newCounselor.agency = [];
          message.error({
            content: i18n.t("message.error.agency.load"),
            duration: 3,
          });
        });
    }
    return newCounselor;
  });
}

export default rebuildCounselorsList;

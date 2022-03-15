import { CounselorData } from "../types/counselor";
import getAgencyByCounselorData from "../api/agency/getAgencyByCounselorData";

import removeEmbedded from "./removeEmbedded";

export const filterCounselorsList = (list: any) => {
  return removeEmbedded(list).filter((obj: CounselorData) => {
    return obj.deleteDate === "null";
  });
};

const rebuildCounselorsList = (list: any) => {
  return list.map((counselor: CounselorData) => {
    const newCounselor = { ...counselor };
    newCounselor.key = counselor.id;
    getAgencyByCounselorData(counselor.id).then((agencies) => {
      newCounselor.agency = agencies;
    });
    console.log("get agency", new Date().toISOString(), newCounselor);
    return newCounselor;
  });
};

export default rebuildCounselorsList;

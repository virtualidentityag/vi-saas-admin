import { CounselorData } from "../types/counselor";
import getAgencyByCounselorData from "../api/agency/getAgencyByCounselorData";

import removeEmbedded from "./removeEmbedded";

export const filterCounselorsList = (list: any) => {
  return removeEmbedded(list);
};

const rebuildCounselorsList = (list: any) => {
  return Promise.all(
    list.map(async (counselor: CounselorData) => {
      const newCounselor = { ...counselor };
      newCounselor.key = counselor.id;
      await getAgencyByCounselorData(counselor.id).then((agencies) => {});
      return newCounselor;
    })
  );
};

export default rebuildCounselorsList;

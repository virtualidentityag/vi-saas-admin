import { CounselorData } from "../types/counselor";
import getAgencyData from "../api/agency/getAgencyData";

function rebuildCounselorsList(list: any) {
  return list.map((listItem: Record<string, any>, index: number) => {
    // eslint-disable-next-line no-underscore-dangle
    console.log(index, listItem._embedded);
    // eslint-disable-next-line no-underscore-dangle
    const counselor: CounselorData = { ...listItem._embedded };
    if (counselor.id) {
      getAgencyData(counselor.id)
        .then((result: any) => {
          counselor.agency = result;
        })
        .catch();
    }

    console.log(index, counselor);
    return counselor;
  });
}

export default rebuildCounselorsList;

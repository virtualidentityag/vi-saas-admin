import { message } from "antd";
import { CounselorData } from "../types/counselor";
import getAgencyData from "../api/agency/getAgencyData";
import i18n from "../i18n";

function rebuildCounselorsList(list: any) {
  return list.map((listItem: Record<string, any>) => {
    // eslint-disable-next-line no-underscore-dangle
    const counselor: CounselorData = { ...listItem._embedded };
    if (counselor.id) {
      getAgencyData(counselor.id)
        .then((result: any) => {
          counselor.agency = [
            // eslint-disable-next-line no-underscore-dangle
            result._embedded.map((embedded: Record<string, any>) => {
              // eslint-disable-next-line no-underscore-dangle
              return embedded._embedded;
            }),
          ];
        })
        .catch(() => {
          message.error({
            content: i18n.t("message.error.agency.load"),
            duration: 3,
          });
        });
    }
    return counselor;
  });
}

export default rebuildCounselorsList;

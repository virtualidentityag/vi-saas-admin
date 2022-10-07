import { useQuery } from "react-query";
import getAgencyDataById from "../api/agency/getAgencyById";
import { AgencyData } from "../types/agency";

export const useAgencyData = (id: string) => {
  return useQuery<AgencyData>(["AGENCY", id], () =>
    getAgencyDataById(id).then(({ _embedded }) => _embedded)
  );
};

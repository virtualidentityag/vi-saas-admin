import { useMutation } from "react-query";
import { updateAgencyData } from "../api/agency/updateAgencyData";
import { AgencyData } from "../types/agency";
import { useAgencyData } from "./useAgencyData";

export const useAgencyUpdate = (id: string) => {
  const { data: agencyData } = useAgencyData(id);

  return useMutation(["AGENCY", id], (data: Partial<AgencyData>) => {
    return updateAgencyData(agencyData, { ...agencyData, ...data });
  });
};

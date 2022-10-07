import { useQuery } from "react-query";
import { hasAgencyConsultants } from "../api/agency/getAgencyConsultants";

export const useAgencyHasConsultants = (id: string) => {
  return useQuery<boolean>(["CONSULTANTS", id], () => hasAgencyConsultants(id));
};

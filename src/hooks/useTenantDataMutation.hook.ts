import { useMutation } from "react-query";
import editTenantData from "../api/tenant/editTenantData";
import { TenantData } from "../types/tenant";

export const useTenantDataMutation = () => {
  return useMutation("tenant-data", (data: TenantData) => editTenantData(data));
};

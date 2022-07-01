import { useQuery } from "react-query";
import getPublicTenantData from "../api/tenant/getPublicTenantData";
import getTenantData from "../api/tenant/getTenantData";

export const TENANT_DATA_KEY = "tenant-data";
export const useTenantData = () =>
  useQuery(TENANT_DATA_KEY, () => getPublicTenantData().then(getTenantData));

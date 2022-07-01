import { useQuery } from "react-query";
import getPublicTenantData from "../api/tenant/getPublicTenantData";

export const PUBLIC_TENANT_DATA_KEY = "public-tenant-data";
export const usePublicTenantData = () =>
  useQuery(PUBLIC_TENANT_DATA_KEY, () => getPublicTenantData());

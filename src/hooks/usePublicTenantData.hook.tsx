import { useQuery } from "react-query";
import getPublicTenantData from "../api/tenant/getPublicTenantData";

const KEY = "public-tenant-data";
export const usePublicTenantData = () =>
  useQuery(KEY, () => getPublicTenantData());

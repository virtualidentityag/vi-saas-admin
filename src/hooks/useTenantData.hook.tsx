import { useQuery } from "react-query";
import getPublicTenantData from "../api/tenant/getPublicTenantData";
import getTenantData from "../api/tenant/getTenantData";

const KEY = "tenant-data";
export const useTenantData = () =>
  useQuery(KEY, () => getPublicTenantData().then(getTenantData));

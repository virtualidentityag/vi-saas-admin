import { useQuery } from "react-query";
import getPublicTenantData from "../api/tenant/getPublicTenantData";
import getTenantData from "../api/tenant/getTenantData";
import { useAppConfigContext } from "../context/useAppConfig";
import { TenantData } from "../types/tenant";

export const TENANT_DATA_KEY = "tenant-data";
export const useTenantData = () => {
  const { settings } = useAppConfigContext();
  return useQuery<TenantData>(TENANT_DATA_KEY, async () =>
    getPublicTenantData(settings).then((tenant) =>
      getTenantData(tenant, settings.multiTenancyWithSingleDomainEnabled)
    )
  );
};

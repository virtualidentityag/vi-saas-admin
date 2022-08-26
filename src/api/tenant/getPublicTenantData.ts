import { fetchData, FETCH_METHODS, FETCH_ERRORS } from "../fetchData";
import { clusterFeatureFlags, baseTenantPublicEndpoint } from "../../appConfig";
import getLocationVariables from "../../utils/getLocationVariables";
/**
 * retrieve all needed public tenant data
 * @return data
 */
const getPublicTenantData = () => {
  const { subdomain } = getLocationVariables();
  const slug = clusterFeatureFlags.useMultiTenancyWithSingleDomain
    ? clusterFeatureFlags.multiTenancyWithSingleDomainSlug
    : subdomain;
  if (slug) {
    return fetchData({
      url: `${baseTenantPublicEndpoint}/${slug}`,
      method: FETCH_METHODS.GET,
      skipAuth: true,
      responseHandling: [FETCH_ERRORS.CATCH_ALL],
    });
  }
  return new Promise<any>(() => {});
};

export default getPublicTenantData;

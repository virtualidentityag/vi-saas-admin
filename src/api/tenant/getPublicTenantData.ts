import { fetchData, FETCH_METHODS, FETCH_ERRORS } from "../fetchData";
import { baseTenantPublicEndpoint } from "../../appConfig";
import getLocationVariables from "../../utils/getLocationVariables";
import { AppConfigInterface } from "../../types/AppConfigInterface";

/**
 * retrieve all needed public tenant data
 * @return data
 */
const getPublicTenantData = (settings: AppConfigInterface) => {
  const { subdomain } = getLocationVariables();
  const slug = settings.multitenancyWithSingleDomainEnabled
    ? settings.mainTenantSubdomainForSingleDomainMultitenancy
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

import { fetchData, FETCH_METHODS, FETCH_ERRORS } from "../fetchData";
import { tenantPublicEndpoint } from "../../appConfig";
import getLocationVariables from "../../utils/getLocationVariables";
/**
 * retrieve all needed public tenant data
 * @return data
 */
const getPublicTenantData = () => {
  const { subdomain } = getLocationVariables();
  if (subdomain) {
    return fetchData({
      url: `${tenantPublicEndpoint}`,
      method: FETCH_METHODS.GET,
      skipAuth: true,
      responseHandling: [FETCH_ERRORS.CATCH_ALL],
    });
  }
  return new Promise<any>(() => {});
};

export default getPublicTenantData;

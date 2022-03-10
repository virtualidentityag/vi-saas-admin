import { fetchData, FETCH_METHODS, FETCH_ERRORS } from "../fetchData";
import { tenantPublicEndpoint } from "../../appConfig";
import storeDispatch from "../../state/actions/storeDispatch";
/**
 * retrieve all needed public tenant data
 * @return data
 */
const getPublicTenantData = () => {
  const tenantResponse = fetchData({
    url: `${tenantPublicEndpoint}`,
    method: FETCH_METHODS.GET,
    skipAuth: true,
    responseHandling: [FETCH_ERRORS.CATCH_ALL],
  });
  tenantResponse.then((response: any) => {
    storeDispatch("tenant/set-data", {
      ...response,
    });
  });
  return tenantResponse;
};

export default getPublicTenantData;

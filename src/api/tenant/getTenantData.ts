import { fetchData, FETCH_METHODS, FETCH_ERRORS } from "../fetchData";
import { tenantEndpoint } from "../../appConfig";
import { LoginData } from "../../types/loginData";
import parseJWT from "../../utils/parseJWT";
import storeDispatch from "../../state/actions/storeDispatch";

/**
 * retrieve all needed tenant data
 * @param tenantId {string}
 * @return {Promise<AxiosResponse<any>>}
 */
const getTenantData = (tenant: LoginData) => {
  const parsedJWT = parseJWT(tenant.access_token || "");
  const tenantResponse = fetchData({
    url: `${tenantEndpoint}${parsedJWT.tenantId}`,
    method: FETCH_METHODS.GET,
    skipAuth: false,
    responseHandling: [FETCH_ERRORS.CATCH_ALL],
  });
  tenantResponse.then((response: any) => {
    console.log("tenant response", response);
    storeDispatch("tenant/set-data", {
      ...response,
    });

    return tenantResponse;
  });
};

export default getTenantData;

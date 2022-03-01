import { TenantData } from "../../types/tenant";
import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";
import { tenantEndpoint } from "../../appConfig";
import { store } from "../../store/store";
import storeDispatch from "../../state/actions/storeDispatch";
/**
 * retrieve all needed tenant data
 * @param tenantData
 * @return data
 */
const editTenantData = (tenantData: TenantData) => {
  const state = store.getState();
  const { id } = state.tenantData;

  const tenantResponse = fetchData({
    url: `${tenantEndpoint}${id}`,
    method: FETCH_METHODS.PUT,
    skipAuth: false,
    responseHandling: [FETCH_ERRORS.CATCH_ALL],
    bodyData: JSON.stringify(tenantData),
  });
  tenantResponse.then((response: any) => {
    storeDispatch("tenant/set-data", {
      ...response,
    });
  });
  return tenantResponse;
};

export default editTenantData;

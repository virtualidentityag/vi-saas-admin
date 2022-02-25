import { TenantData } from "../../types/tenant";
import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";
import { tenantEndpoint } from "../../appConfig";
import { store } from "../../store/store";
/**
 * retrieve all needed tenant data
 * @param tenantData
 * @return data
 */
const editTenantData = (tenantData: TenantData) => {
  // eslint-disable-next-line no-console
  console.log("edit TenantData", tenantData);
  const state = store.getState();
  const { id } = state.tenantData;

  const tenantResponse = fetchData({
    url: `${tenantEndpoint}${id}`,
    method: FETCH_METHODS.PUT,
    skipAuth: false,
    responseHandling: [FETCH_ERRORS.CATCH_ALL],
    bodyData: JSON.stringify(tenantData),
  });
  return tenantResponse;
};

export default editTenantData;

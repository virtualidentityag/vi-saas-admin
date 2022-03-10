import { fetchData, FETCH_METHODS, FETCH_ERRORS } from "../fetchData";
import { tenantEndpoint } from "../../appConfig";
import storeDispatch from "../../state/actions/storeDispatch";
import { store } from "../../store/store";
/**
 * retrieve all needed tenant data
 * @return data
 */
const getTenantData = () =>
  new Promise((resolve, reject) => {
    const state = store.getState();
    const tenantResponse = fetchData({
      url: `${tenantEndpoint}${state.tenantData.id}`,
      method: FETCH_METHODS.GET,
      skipAuth: false,
      responseHandling: [FETCH_ERRORS.CATCH_ALL],
    });
    tenantResponse
      .then((response: any) => {
        storeDispatch("tenant/set-data", {
          ...response,
        });
        resolve(tenantResponse);
      })
      .catch(() => {
        reject(new Error("tenantData"));
      });
  });
export default getTenantData;

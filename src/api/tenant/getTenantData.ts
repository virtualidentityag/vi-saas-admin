import { fetchData, FETCH_METHODS } from "../fetchData";
import { tenantEndpoint } from "../../appConfig";
import storeDispatch from "../../state/actions/storeDispatch";
import { store } from "../../store/store";
import pubsub, { PubSubEvents } from "../../state/pubsub/PubSub";

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
      responseHandling: [],
    });
    tenantResponse
      .then((response: any) => {
        const checkNull = (value: string | null) => (!value ? "" : value);
        storeDispatch("tenant/set-data", {
          ...response,
          impressum: checkNull(response.impressum),
          privacy: checkNull(response.privacy),
          termsAndConditions: checkNull(response.termsAndConditions),
          secondaryColor: checkNull(response.secondaryColor),
        });
        pubsub.publishEvent(PubSubEvents.USER_AUTHORISED, true);
        resolve(tenantResponse);
      })
      .catch(() => {
        reject(new Error("tenantData"));
      });
  });
export default getTenantData;

import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";
import { consultingTypeEndpoint } from "../../appConfig";

export default async function getConsultingType4Tenant() {
  const consultingTypeResponse = await fetchData({
    url: `${consultingTypeEndpoint}/basic`,
    method: FETCH_METHODS.GET,
    skipAuth: false,
    responseHandling: [FETCH_ERRORS.CATCH_ALL],
  });
  // SAAS currently doesn't support multiple consulting types per tenant
  return consultingTypeResponse[0].id;
}

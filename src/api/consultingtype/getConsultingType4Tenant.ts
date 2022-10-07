import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";
import { consultingTypeEndpoint } from "../../appConfig";
import { parseUserAuthInfo } from "../../utils/parseUserAuthInfo";

export default async function getConsultingType4Tenant(): Promise<string> {
  const { tenantId } = parseUserAuthInfo();
  const consultingTypeResponse = await fetchData({
    url: `${consultingTypeEndpoint}/basic`,
    method: FETCH_METHODS.GET,
    skipAuth: false,
    responseHandling: [FETCH_ERRORS.CATCH_ALL],
  });

  // SAAS currently doesn't support multiple consulting types per tenant
  if (tenantId !== undefined) {
    return consultingTypeResponse.find(
      (consultingType) => consultingType.tenantId === tenantId
    )?.id;
  }
  return consultingTypeResponse[0].id;
}

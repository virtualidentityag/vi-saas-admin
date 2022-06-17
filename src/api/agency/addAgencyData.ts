import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";
import { agencyEndpointBase } from "../../appConfig";
import updateAgencyPostCodeRange from "./updateAgencyPostCodeRange";
import getConsultingType4Tenant from "../consultingtype/getConsultingType4Tenant";

function buildAgencyDataRequestBody(
  consultingTypeResponseId: string,
  formData: Record<string, any>
) {
  return JSON.stringify({
    // diocese in case of SAAS is not relevant object but enforced by API
    dioceseId: 0,
    name: formData.name,
    description: formData.description,
    topicIds: formData.topicIds,
    postcode: formData.postcode,
    city: formData.city,
    consultingType: consultingTypeResponseId,
    teamAgency: formData.teamAgency ? formData.teamAgency : false,
    // enforced by admin API, without business value for SAAS
    external: false,
    offline: formData.offline,
  });
}

async function createAgency(agencyDataRequestBody: string) {
  return fetchData({
    url: agencyEndpointBase,
    method: FETCH_METHODS.POST,
    skipAuth: false,
    responseHandling: [FETCH_ERRORS.CATCH_ALL],
    bodyData: agencyDataRequestBody,
  }).then((addAgencyResponse) => {
    return addAgencyResponse.json();
  });
}

/**
 * add new agency
 * @param agencyData
 * @return data
 */
async function addAgencyData(agencyData: Record<string, any>) {
  const consultingTypeId = await getConsultingType4Tenant();
  const agencyDataRequestBody = buildAgencyDataRequestBody(
    consultingTypeId,
    agencyData
  );
  const agencyCreationResponse = await createAgency(agencyDataRequestBody);

  // eslint-disable-next-line no-underscore-dangle
  const { id } = agencyCreationResponse._embedded;
  return updateAgencyPostCodeRange(id, agencyData, "POST");
}

export default addAgencyData;

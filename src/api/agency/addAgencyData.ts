import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";
import { agencyEndpointBase, consultingTypeEndpoint } from "../../appConfig";
import updateAgencyPostCodeRange from "./updateAgencyPostCodeRange";

/**
 * add new agency
 * @param agencyData
 * @return data
 */

function getConsultingType4Tenant() {
  return fetchData({
    url: `${consultingTypeEndpoint}/basic`,
    method: FETCH_METHODS.GET,
    skipAuth: false,
    responseHandling: [FETCH_ERRORS.CATCH_ALL],
  });
}

function buildAgencyDataRequestBody(
  consultingTypeResponseId: string,
  agencyData: Record<string, any>
) {
  return {
    dioceseId: 0,
    name: agencyData.name,
    description: agencyData.description,
    postcode: agencyData.postcode,
    city: agencyData.city,
    teamAgency: agencyData.teamAgency ? agencyData.teamAgency : false,
    consultingType: consultingTypeResponseId,
    external: false,
    offline: agencyData.offline,
  };
}

const addAgencyData = (agencyData: Record<string, any>) => {
  return new Promise((resolve) => {
    getConsultingType4Tenant().then((consultingTypeResponse) => {
      const agencyDataRequestBody = JSON.stringify(
        buildAgencyDataRequestBody(consultingTypeResponse[0].id, agencyData)
      );

      return fetchData({
        url: agencyEndpointBase,
        method: FETCH_METHODS.POST,
        skipAuth: false,
        responseHandling: [FETCH_ERRORS.CATCH_ALL],
        bodyData: agencyDataRequestBody,
      })
        .then((addAgencyResponse) => {
          return addAgencyResponse.json();
        })
        .then((response) => {
          // eslint-disable-next-line no-underscore-dangle
          const { id } = response._embedded;
          updateAgencyPostCodeRange(id, agencyData, "POST");
          resolve(null);
        });
    });
  });
};

export default addAgencyData;

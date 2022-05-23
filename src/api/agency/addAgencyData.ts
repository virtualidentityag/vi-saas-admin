import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";
import { agencyEndpointBase, consultingTypeEndpoint } from "../../appConfig";
import addAgencyPostcodeRange from "./addAgencyPostCodeRange";

/**
 * add new agency
 * @param agencyData
 * @return data
 */
const addAgencyData = (agencyData: Record<string, any>) => {
  return new Promise((resolve) => {
    fetchData({
      url: `${consultingTypeEndpoint}/basic`,
      method: FETCH_METHODS.GET,
      skipAuth: false,
      responseHandling: [FETCH_ERRORS.CATCH_ALL],
    }).then((consultingTypeResponse) => {
      const agencyDataRequestBody = {
        dioceseId: 1,
        name: agencyData.name,
        description: agencyData.description,
        postcode: agencyData.postcode,
        city: agencyData.city,
        teamAgency: agencyData.teamAgency ? agencyData.teamAgency : false,
        consultingType: consultingTypeResponse[0].id,
        url: agencyData.url,
        external: false,
        offline: agencyData.offline,
      };

      return fetchData({
        url: agencyEndpointBase,
        method: FETCH_METHODS.POST,
        skipAuth: false,
        responseHandling: [FETCH_ERRORS.CATCH_ALL],
        bodyData: JSON.stringify(agencyDataRequestBody),
      })
        .then((addAgencyResponse) => {
          return addAgencyResponse.json();
        })
        .then((response) => {
          // eslint-disable-next-line no-underscore-dangle
          const { id } = response._embedded;
          addAgencyPostcodeRange(id);
          resolve(null);
        });
    });
  });
};

export default addAgencyData;

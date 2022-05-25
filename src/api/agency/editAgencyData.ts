import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";
import { agencyEndpointBase, consultingTypeEndpoint } from "../../appConfig";
import { AgencyData } from "../../types/agency";
import updateAgencyPostCodeRange from "./updateAgencyPostCodeRange";

/**
 * edit agency
 * @param agencyData - newly fetched agency data from backend
 * @param formData - input data from form
 * @return data
 */
const editAgencyData = (agencyData: AgencyData, formData: AgencyData) => {
  const agencyId = agencyData.id;
  if (agencyId == null) {
    throw Error("agency id must be present");
  }

  if (agencyData.teamAgency !== formData.teamAgency) {
    let agencyTyoeChangeRequestBody = null;
    if (formData.teamAgency === "true") {
      agencyTyoeChangeRequestBody = { agencyType: "TEAM_AGENCY" };
    } else {
      agencyTyoeChangeRequestBody = { agencyType: "DEFAULT_AGENCY" };
    }

    fetchData({
      url: `${agencyEndpointBase}/${agencyData.id}/changetype`,
      method: FETCH_METHODS.POST,
      skipAuth: false,
      responseHandling: [FETCH_ERRORS.CATCH_ALL],
      bodyData: JSON.stringify(agencyTyoeChangeRequestBody),
    });
  }

  return fetchData({
    url: `${consultingTypeEndpoint}/basic`,
    method: FETCH_METHODS.GET,
    skipAuth: false,
    responseHandling: [FETCH_ERRORS.CATCH_ALL],
  }).then((consultingTypeResponse) => {
    const agencyDataRequestBody = {
      dioceseId: 0,
      name: formData.name,
      description: formData.description,
      postcode: formData.postcode,
      city: formData.city,
      consultingType: consultingTypeResponse[0].id,
      offline: formData.offline,
      external: false,
    };

    return updateAgencyPostCodeRange(agencyId, formData, "PUT").then(() => {
      return fetchData({
        url: `${agencyEndpointBase}/${agencyData.id}`,
        method: FETCH_METHODS.PUT,
        skipAuth: false,
        responseHandling: [FETCH_ERRORS.CATCH_ALL],
        bodyData: JSON.stringify(agencyDataRequestBody),
      });
    });
  });
};

export default editAgencyData;

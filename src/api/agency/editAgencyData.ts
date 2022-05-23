import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";
import { agencyEndpointBase } from "../../appConfig";
import { AgencyData } from "../../types/agency";

/**
 * edit agency
 * @param agencyData - newly fetched agency data from backend
 * @param formData - input data from form
 * @return data
 */
const editAgencyData = (agencyData: AgencyData, formData: AgencyData) => {
  if (agencyData.teamAgency !== formData.teamAgency) {
    let agencyTyoeChangeRequestBody = null;
    if (formData.teamAgency === "true") {
      agencyTyoeChangeRequestBody = { agencyType: "TEAM_AGENCY" };
    } else {
      agencyTyoeChangeRequestBody = { agencyType: "DEFAULT_AGENCY" };
    }

    return fetchData({
      url: `${agencyEndpointBase}/${agencyData.id}/changetype`,
      method: FETCH_METHODS.POST,
      skipAuth: false,
      responseHandling: [FETCH_ERRORS.CATCH_ALL],
      bodyData: JSON.stringify(agencyTyoeChangeRequestBody),
    });
  }

  const agencyDataRequestBody = {
    id: agencyData.id,
    dioceseId: 0,
    name: formData.name,
    description: formData.description,
    postcode: formData.postcode,
    city: formData.city,
    teamAgency: formData.teamAgency ? formData.teamAgency : false,
    consultingType: 1,
    url: formData.url,
    external: false,
    offline: formData.offline,
  };

  return fetchData({
    url: `${agencyEndpointBase}/${agencyData.id}`,
    method: FETCH_METHODS.PUT,
    skipAuth: false,
    responseHandling: [FETCH_ERRORS.CATCH_ALL],
    bodyData: JSON.stringify(agencyDataRequestBody),
  });
};

export default editAgencyData;

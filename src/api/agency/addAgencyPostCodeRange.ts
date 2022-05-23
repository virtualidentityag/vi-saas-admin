import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";
import { agencyPostcodeRangeEndpointBase } from "../../appConfig";

/**
 * add new agency postcode range
 * @param agencyData
 * @return data
 */
const addAgencyPostcodeRange = (id: string) => {
  const postcodeRange = {
    postcodeRanges: "00000-99999",
  };

  return fetchData({
    url: `${agencyPostcodeRangeEndpointBase}/${id}`,
    method: FETCH_METHODS.POST,
    skipAuth: false,
    responseHandling: [FETCH_ERRORS.CATCH_ALL],
    bodyData: JSON.stringify(postcodeRange),
  }).then((response) => {
    if (response.status === 200) {
      return response.json();
    }
    return response.json();
  });

  return new Promise(() => {});
};

export default addAgencyPostcodeRange;

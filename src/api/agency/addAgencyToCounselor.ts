import { counselorEndpoint } from "../../appConfig";

import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";

/**
 * retrieve all needed counselor data
 * @return {Promise}
 */
const addAgencyToCounselor = (
  counselorId: string,
  agencyId: string | string[]
) => {
  // retrieve Counselor

  console.log("addAgencyToCounselor", counselorId, agencyId);

  return fetchData({
    url: `${counselorEndpoint}/${counselorId}/agencies`,
    method: FETCH_METHODS.POST,
    skipAuth: false,
    responseHandling: [FETCH_ERRORS.CATCH_ALL],
    bodyData: JSON.stringify({
      agencyId,
      role: "CONSULTANT_DEFAULT",
    }),
  });
};

export default addAgencyToCounselor;
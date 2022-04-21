import { counselorEndpoint } from "../../appConfig";

import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";

/**
 * deletes/deattachs agency from counselor
 * @return {Promise}
 */
const deleteAgencyFromCounselor = (
  counselorId: string,
  agencyIds: string[]
) => {
  return Promise.all(
    agencyIds.map((agencyId) => {
      return fetchData({
        url: `${counselorEndpoint}/${counselorId}/agencies/${agencyId}`,
        method: FETCH_METHODS.DELETE,
        skipAuth: false,
        responseHandling: [FETCH_ERRORS.CATCH_ALL],
      });
    })
  );
};

export default deleteAgencyFromCounselor;

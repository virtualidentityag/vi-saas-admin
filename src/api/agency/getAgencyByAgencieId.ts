import { agencyDataAgencyId } from "../../appConfig";

import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";

/**
 * retrieve all needed agency data
 * @return {Promise}
 */
const getAgencyDataAgencyId = (agencyId: string) => {
  return fetchData({
    url: `${agencyDataAgencyId}`.replaceAll("{agencyId}", agencyId),
    method: FETCH_METHODS.GET,
    skipAuth: false,
    responseHandling: [FETCH_ERRORS.CATCH_ALL],
  });
};

export default getAgencyDataAgencyId;

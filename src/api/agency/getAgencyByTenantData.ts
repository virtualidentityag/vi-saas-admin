import { agencyEndpoint } from "../../appConfig";

import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";

/**
 * retrieve all needed agency data
 * @return {Promise}
 */
const getAgencyByTenantData = () => {
  return fetchData({
    url: `${agencyEndpoint}`,
    method: FETCH_METHODS.GET,
    skipAuth: false,
    responseHandling: [FETCH_ERRORS.CATCH_ALL],
  });
};

export default getAgencyByTenantData;

import { counselorEndpoint } from "../../appConfig";

import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";

/**
 * retrieve all needed counselor data
 * @return {Promise}
 */
const getCounselorData = () => {
  // retrieve Counselor

  return fetchData({
    url: counselorEndpoint,
    method: FETCH_METHODS.GET,
    skipAuth: false,
    responseHandling: [FETCH_ERRORS.CATCH_ALL],
  });
};

export default getCounselorData;

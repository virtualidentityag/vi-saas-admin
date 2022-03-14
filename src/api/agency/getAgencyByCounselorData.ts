import { counselorEndpoint } from "../../appConfig";

import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";
import removeEmbedded from "../../utils/removeEmbedded";

/**
 * retrieve all needed counselor data
 * @return {Promise}
 */
const getAgencyByCounselorData = (counselorId: string) => {
  // retrieve Counselor

  return fetchData({
    url: `${counselorEndpoint}/${counselorId}/agencies`,
    method: FETCH_METHODS.GET,
    skipAuth: false,
    responseHandling: [FETCH_ERRORS.CATCH_ALL],
  }).then((rawAgencies) => {
    // eslint-disable-next-line no-underscore-dangle
    return [...removeEmbedded(rawAgencies._embedded)];
  });
};

export default getAgencyByCounselorData;

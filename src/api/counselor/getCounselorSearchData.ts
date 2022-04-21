import { counselorSearchEndpoint } from "../../appConfig";

import { FETCH_METHODS, fetchData } from "../fetchData";
import removeEmbedded from "../../utils/removeEmbedded";

/**
 * retrieve all needed counselor data
 * @return {Promise}
 */
const getCounselorSearchData = (state: TableState, query: string) => {
  // retrieve Counselor
  return fetchData({
    url: `${counselorSearchEndpoint}/?query=${encodeURIComponent(query)}&page=${
      state.current
    }&perPage=100`,
    method: FETCH_METHODS.GET,
    skipAuth: false,
    responseHandling: [],
  }).then((result) => {
    // eslint-disable-next-line no-underscore-dangle
    return removeEmbedded(result);
  });
};

export default getCounselorSearchData;

import { counselorSearchEndpoint } from "../../appConfig";

import { FETCH_METHODS, fetchData } from "../fetchData";
import removeEmbedded from "../../utils/removeEmbedded";
import { DEFAULT_ORDER, DEFAULT_SORT } from "./getCounselorData";

/**
 * retrieve all needed counselor data
 * @return {Promise}
 */
const getCounselorSearchData = (state: TableState, query: string) => {
  let { sortBy } = state || DEFAULT_SORT;
  let { order } = state || DEFAULT_ORDER;

  sortBy = sortBy.toUpperCase();
  order = order.toUpperCase();

  return fetchData({
    url: `${counselorSearchEndpoint}/?query=${encodeURIComponent(query)}&page=${
      state.current
    }&perPage=10&order=${order}&field=${sortBy}`,
    method: FETCH_METHODS.GET,
    skipAuth: false,
    responseHandling: [],
  }).then((result) => {
    // eslint-disable-next-line no-underscore-dangle
    return removeEmbedded(result);
  });
};

export default getCounselorSearchData;

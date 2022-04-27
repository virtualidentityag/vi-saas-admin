import { counselorSearchEndpoint } from "../../appConfig";

import { FETCH_METHODS, fetchData } from "../fetchData";
import removeEmbedded from "../../utils/removeEmbedded";

export const DEFAULT_SORT = "FIRSTNAME";
export const DEFAULT_ORDER = "ASC";

/**
 * retrieve all needed counselor data
 * @return {Promise}
 */
const getCounselorSearchData = (state: TableState, query: string) => {
  const { sortBy } = state || DEFAULT_SORT;
  const { order } = state || DEFAULT_ORDER;

  let searchQuery = query;

  if (query.length <= 0) searchQuery = "*";

  return fetchData({
    url: `${counselorSearchEndpoint}?query=${encodeURIComponent(
      searchQuery
    )}&page=${state.current}&perPage=10&order=${order}&field=${sortBy}`,
    method: FETCH_METHODS.GET,
    skipAuth: false,
    responseHandling: [],
  }).then((result) => {
    return removeEmbedded(result);
  });
};

export default getCounselorSearchData;

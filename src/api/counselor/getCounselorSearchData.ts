import { usersConsultantsSearchEndpoint } from "../../appConfig";

import { FETCH_METHODS, fetchData } from "../fetchData";
import removeEmbedded from "../../utils/removeEmbedded";

export const DEFAULT_SORT = "FIRSTNAME";
export const DEFAULT_ORDER = "ASC";
export const DEFAULT_PAGESIZE = 10;

/**
 * retrieve all needed counselor data
 * @return {Promise}
 */
const getCounselorSearchData = (state: TableState, query: string) => {
  const { sortBy } = state || DEFAULT_SORT;
  const { order } = state || DEFAULT_ORDER;
  const { pageSize } = state || DEFAULT_PAGESIZE;

  let searchQuery = query;

  if (query.length <= 0) searchQuery = "*";

  return fetchData({
    url: `${usersConsultantsSearchEndpoint}?query=${encodeURIComponent(
      searchQuery
    )}&page=${
      state.current
    }&perPage=${pageSize}&order=${order}&field=${sortBy}`,
    method: FETCH_METHODS.GET,
    skipAuth: false,
    responseHandling: [],
  }).then((result) => {
    return removeEmbedded(result);
  });
};

export default getCounselorSearchData;

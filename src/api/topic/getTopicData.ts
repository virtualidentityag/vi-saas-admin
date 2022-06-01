import { topicEndpoint } from "../../appConfig";

import { FETCH_METHODS, fetchData } from "../fetchData";
import removeEmbedded from "../../utils/removeEmbedded";

export const DEFAULT_SORT = "NAME";
export const DEFAULT_ORDER = "ASC";

/**
 * retrieve all topics for tenant context
 * @return {Promise}
 */
const getTopicData = (params: TableState) => {
  // retrieve Topics

  let sortBy = params.sortBy || DEFAULT_SORT;
  let order = params.order || DEFAULT_ORDER;

  sortBy = sortBy.toUpperCase();
  order = order.toUpperCase();

  return fetchData({
    url: `${topicEndpoint}/?page=${params.current}&perPage=10&order=${order}&field=${sortBy}`,
    method: FETCH_METHODS.GET,
    skipAuth: false,
    responseHandling: [],
  }).then((result) => {
    return {
      total: result.length,
      data: result,
    };
  });
};

export default getTopicData;

import { counselorEndpoint } from "../../appConfig";

import { FETCH_METHODS, fetchData } from "../fetchData";
import removeEmbedded from "../../utils/removeEmbedded";

/**
 * retrieve all needed counselor data
 * @return {Promise}
 */
const getCounselorData = (params: TableState) => {
  // retrieve Counselor

  let { sortBy } = params;
  let { order } = params;

  if (sortBy === undefined) {
    sortBy = "FIRSTNAME";
  }

  if (order === undefined) {
    order = "ASC";
  }

  sortBy = sortBy.toUpperCase();
  order = order.toUpperCase();

  return fetchData({
    url: `${counselorEndpoint}/?page=${params.current}&perPage=10&order=${order}&field=${sortBy}`,
    method: FETCH_METHODS.GET,
    skipAuth: false,
    responseHandling: [],
  }).then((result) => {
    // eslint-disable-next-line no-underscore-dangle
    return removeEmbedded(result);
  });
};

export default getCounselorData;

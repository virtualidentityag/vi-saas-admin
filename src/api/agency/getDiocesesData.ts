import { diocesesEndpoint } from "../../appConfig";

import { FETCH_METHODS, fetchData } from "../fetchData";

export const DEFAULT_SORT = "NAME";
export const DEFAULT_ORDER = "ASC";

/**
 * retrieve all agencies for tenant context
 * @return {Promise}
 */
export const getDiocesesData = () => {
  return fetchData({
    url: `${diocesesEndpoint}/?page=1&perPage=999`,
    method: FETCH_METHODS.GET,
    skipAuth: false,
    responseHandling: [],
  }).then((result) => {
    // eslint-disable-next-line no-underscore-dangle
    return result?._embedded;
  });
};

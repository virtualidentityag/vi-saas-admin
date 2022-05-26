import { agencyEndpointBase } from "../../appConfig";

import { FETCH_METHODS, fetchData } from "../fetchData";
import removeEmbedded from "../../utils/removeEmbedded";

export const DEFAULT_SORT = "NAME";
export const DEFAULT_ORDER = "ASC";

/**
 * retrieve all agencies for tenant context
 * @return {Promise}
 */
const getAgencyData = (params: TableState) => {
  // retrieve Agencies

  let sortBy = params.sortBy || DEFAULT_SORT;
  let order = params.order || DEFAULT_ORDER;

  sortBy = sortBy.toUpperCase();
  order = order.toUpperCase();

  const resolveAgencyStatus = (el: any) => {
    if (el.deleteDate !== "null") {
      return "IN_DELETION";
    }
    return "CREATED";
  };

  return fetchData({
    url: `${agencyEndpointBase}/?page=${params.current}&perPage=10&order=${order}&field=${sortBy}`,
    method: FETCH_METHODS.GET,
    skipAuth: false,
    responseHandling: [],
  })
    .then((result) => {
      // eslint-disable-next-line no-underscore-dangle
      return removeEmbedded(result);
    })
    .then((result) => {
      return {
        total: result.total,
        data: result.data.map((el: any) => {
          return {
            ...el,
            teamAgency: el.teamAgency ? "true" : "false",
            status: resolveAgencyStatus(el),
          };
        }),
      };
    });
};

export default getAgencyData;

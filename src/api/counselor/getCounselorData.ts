import { counselorEndpoint } from "../../appConfig";

import { FETCH_METHODS, fetchData } from "../fetchData";
import rebuildCounselorsList, {
  filterCounselorsList,
} from "../../utils/rebuildCounselorList";

/**
 * retrieve all needed counselor data
 * @return {Promise}
 */
const getCounselorData = (page: string) => {
  // retrieve Counselor
  return fetchData({
    url: `${counselorEndpoint}/?page=${page}&perPage=100`,
    method: FETCH_METHODS.GET,
    skipAuth: false,
    responseHandling: [],
  })
    .then((result) => {
      // eslint-disable-next-line no-underscore-dangle
      return filterCounselorsList(result._embedded);
    })
    .then((filteredCounselorsList) => {
      return rebuildCounselorsList(filteredCounselorsList);
    });
};

export default getCounselorData;

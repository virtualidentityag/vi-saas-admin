import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";
import { consultantsForAgencyEndpoint } from "../../appConfig";

/**
 * has agency consultants
 * @param id - agency id
 * @return boolean
 */
const hasAgencyConsultants = (agencyId: string) => {
  return fetchData({
    url: `${consultantsForAgencyEndpoint}`.replaceAll("{agencyId}", agencyId),
    method: FETCH_METHODS.GET,
    skipAuth: false,
    responseHandling: [FETCH_ERRORS.CATCH_ALL],
  }).then((data) => {
    return data.total > 0;
  });
};

export default hasAgencyConsultants;

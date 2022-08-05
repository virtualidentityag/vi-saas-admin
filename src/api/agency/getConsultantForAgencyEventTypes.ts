import { consultantsForAgencyEventTypes } from "../../appConfig";

import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";

/**
 * retrieve all needed agency event type data
 * @return {Promise}
 */
const getConsultantForAgencyEventTypes = (
  agencyId: string,
  eventTypeId: number
) => {
  const agencyReplace = `${consultantsForAgencyEventTypes}`.replaceAll(
    "{agencyId}",
    agencyId
  );
  const url = `${agencyReplace}`.replaceAll(
    "{eventTypeId}",
    eventTypeId.toString()
  );
  return fetchData({
    url,
    method: FETCH_METHODS.GET,
    skipAuth: false,
    responseHandling: [FETCH_ERRORS.CATCH_ALL],
  });
};

export default getConsultantForAgencyEventTypes;

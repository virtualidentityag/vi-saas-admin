import { consultantsForAgencyEventTypes } from "../../appConfig";

import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";

/**
 * retrieve agency event type by id
 * @return {Promise}
 */
const getAgencyEventTypeById = (agencyId: string, eventTypeId: number) => {
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

export default getAgencyEventTypeById;

import { consultantsForAgencyEventTypes } from "../../appConfig";

import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";

/**
 * delete agency event type data
 * @return {Promise}
 */
const deleteAgencyEventType = (agencyId: string, eventTypeId: number) => {
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
    method: FETCH_METHODS.DELETE,
    skipAuth: false,
    responseHandling: [FETCH_ERRORS.CATCH_ALL],
  });
};

export default deleteAgencyEventType;

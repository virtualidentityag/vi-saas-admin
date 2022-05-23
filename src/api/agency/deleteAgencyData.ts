import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";
import { agencyEndpointBase } from "../../appConfig";
import { AgencyData } from "../../types/agency";

/**
 * delete agency
 * @param agencyData
 * @return data
 */
const deleteAgencyData = (agencyData: AgencyData) => {
  const { id } = agencyData;

  const counselor = fetchData({
    url: `${agencyEndpointBase}/${id}`,
    method: FETCH_METHODS.DELETE,
    skipAuth: false,
    responseHandling: [FETCH_ERRORS.CATCH_ALL],
  });

  return counselor;
};

export default deleteAgencyData;

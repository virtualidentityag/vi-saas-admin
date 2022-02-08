import { AxiosResponse } from "axios";
import clearStore from "../../state/actions/clearStore";
import routePathNames from "../../appConfig";
import handleError from "../../utils/handleError";

interface MinimalResponseSet {
  status: number;
  statusText: string;
}

/**
 * redirect handler
 * @param response {AxiosResponse|MinimalResponseSet}
 */
const redirectIfUnauthorized = (
  response: AxiosResponse | MinimalResponseSet
) => {
  const { status, statusText } = response;

  /*
   * reroute to remain
   * spotify:track:3YDUqJknavFEZbCTN1cjsB
   */
  if (status === 401 || statusText.toLowerCase() === "unauthorized") {
    clearStore();

    window.location.href = `${routePathNames.root}?referrer=${window.location.pathname}${window.location.search}`;
  } else {
    handleError(statusText);
  }
};

export default redirectIfUnauthorized;

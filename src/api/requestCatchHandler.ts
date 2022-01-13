import axios from "axios";
import handleError from "../utils/handleError";
import objectHasKey from "../utils/objectHasKey";
import redirectIfUnauthorized from "./auth/redirectIfUnauthorized";

/**
 * helper to catch network requests with axios
 * @param error {*}
 */
const requestCatchHandler = (error: any) => {
  if (!axios.isCancel(error)) {
    if (error?.response && objectHasKey(error.response, "status")) {
      redirectIfUnauthorized(error.response);
    } else {
      handleError(error);
    }
  }
};

export default requestCatchHandler;

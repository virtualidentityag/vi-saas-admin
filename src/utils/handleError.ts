import objectHasKey from "./objectHasKey";

/**
 * generic handler to use in e.g. .catch()
 * @param error {*}
 * @param customMessage {string}
 * @return {Promise<reject>}
 */
const handleError = (error: any, customMessage = "Error:") => {
  if (error) {
    Promise.resolve(error)
      .then((errorPromise: any) => {
        if (
          errorPromise?.response &&
          objectHasKey(errorPromise.response, "status")
        ) {
          const { status, statusText } = errorPromise.response;

          if (status && statusText) {
            throw new Error(`${customMessage} ${statusText}, ${status}`);
          }
        }

        Promise.reject(error);
      })
      // eslint-disable-next-line no-console
      .catch((msg) => console.error(msg));
  }
};

export default handleError;

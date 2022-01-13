import axios, { CancelTokenSource } from "axios";

/**
 * wrapper for axios CancelToken
 */
const getCancelTokenSource = () => axios.CancelToken.source();

/**
 * renew a canceltoken and cancel calls with the current one
 * @param cancelTokenSource
 */
const cancelAndRenewCancelToken = (cancelTokenSource: CancelTokenSource) => {
  cancelTokenSource.cancel();

  return getCancelTokenSource();
};

export default getCancelTokenSource;
export { cancelAndRenewCancelToken };

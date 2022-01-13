import { CancelTokenSource } from "axios";
import axiosWithAuth from "../axiosWithAuth";
import { counselorEndpoint } from "../endpoints";
import requestCatchHandler from "../requestCatchHandler";

/**
 * retrieve all needed counselor data
 * @param cancelTokenSource {CancelTokenSource}
 * @return {Promise<AxiosResponse<any>>}
 */
const getCounselorData = (cancelTokenSource: CancelTokenSource) => {
  // retrieve Counselor
  return axiosWithAuth()
    .get(counselorEndpoint, {
      cancelToken: cancelTokenSource.token,
    })
    .then((response: any) => {
      if (
        !response?.data?.data ||
        !response?.data?.included ||
        response.status > 201
      ) {
        return [];
      }
      const data = response;

      if (data) {
        return data;
      }

      return [{}];
    })
    .catch(requestCatchHandler);
};

export default getCounselorData;

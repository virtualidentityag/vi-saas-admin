import { CounselorData } from "../../types/counselor";
import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";
import { counselorEndpoint } from "../../appConfig";

/**
 * delete counselor
 * @param counselorData
 * @return data
 */
const editCounselorData = (counselorData: CounselorData) => {
  const { id } = counselorData;

  const counselor = fetchData({
    url: `${counselorEndpoint}/${id}`,
    method: FETCH_METHODS.DELETE,
    skipAuth: false,
    responseHandling: [FETCH_ERRORS.CATCH_ALL],
  });

  return counselor;
};

export default editCounselorData;

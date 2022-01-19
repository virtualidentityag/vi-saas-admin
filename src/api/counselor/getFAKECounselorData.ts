import { CancelTokenSource } from "axios";
import { fakeCounselors } from "./addFAKECounselorData";

/**
 * retrieve all needed counselor data
 * @param cancelTokenSource {CancelTokenSource}
 * @return data
 */
const getCounselorData = (cancelTokenSource: CancelTokenSource) => {
  // retrieve Counselor
  const counselorResponse: any[] = [];
  fakeCounselors(counselorResponse);

  // eslint-disable-next-line no-console
  console.log("FAKE get CounselorDta", counselorResponse, cancelTokenSource);

  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(counselorResponse);
    }, 1000);
  });
};

export default getCounselorData;

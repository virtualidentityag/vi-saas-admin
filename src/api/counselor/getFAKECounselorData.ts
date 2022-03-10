import { fakeCounselors } from "./addFAKECounselorData";

/**
 * retrieve all needed counselor data
 * @return data
 */
const getCounselorData = () => {
  // retrieve Counselor
  const counselorResponse: any[] = [];
  fakeCounselors(counselorResponse);

  // eslint-disable-next-line no-console
  console.log("FAKE get CounselorDta", counselorResponse);

  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(counselorResponse);
    }, 1000);
  });
};

export default getCounselorData;

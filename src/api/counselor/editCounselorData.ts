import { CounselorData } from "../../types/counselor";
import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";
import { counselorEndpoint } from "../../appConfig";
import { encodeUsername } from "../../utils/encryptionHelpers";

/**
 * edit counselor
 * @param counselorData
 * @return data
 */
const editCounselorData = (counselorData: CounselorData) => {
  const {
    firstname,
    lastname,
    formalLanguage,
    email,
    absent,
    username,
    absenceMessage,
    id,
  } = counselorData;

  // just use needed data from whole form data
  const strippedCounselor = {
    firstname,
    lastname,
    formalLanguage,
    email,
    absent,
    username: encodeUsername(username),
    absenceMessage: absent ? absenceMessage : null,
  };

  return fetchData({
    url: `${counselorEndpoint}/${id}`,
    method: FETCH_METHODS.PUT,
    skipAuth: false,
    responseHandling: [FETCH_ERRORS.CATCH_ALL],
    bodyData: JSON.stringify(strippedCounselor),
  });
};

export default editCounselorData;

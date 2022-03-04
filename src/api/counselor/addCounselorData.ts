import { CounselorData } from "../../types/counselor";
import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";
import { counselorEndpoint } from "../../appConfig";
import { encodeUsername } from "../../utils/encryptionHelpers";

/**
 * add new counselor
 * @param counselorData
 * @return data
 */
const addCounselorData = (counselorData: CounselorData) => {
  const { firstname, lastname, formalLanguage, email, absent, username } =
    counselorData;

  // just use needed data from hole form data
  const strippedCounselor = {
    firstname,
    lastname,
    formalLanguage,
    email,
    absent,
    username: encodeUsername(username),
  };

  return fetchData({
    url: counselorEndpoint,
    method: FETCH_METHODS.POST,
    skipAuth: false,
    responseHandling: [FETCH_ERRORS.CATCH_ALL],
    bodyData: JSON.stringify(strippedCounselor),
  });
};

export default addCounselorData;

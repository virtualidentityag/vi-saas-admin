import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";
import { counselorEndpoint } from "../../appConfig";
import { encodeUsername } from "../../utils/encryptionHelpers";

/**
 * add new counselor
 * @param counselorData
 * @return data
 */
const addCounselorData = (counselorData: Record<string, any>) => {
  const { firstname, lastname, formalLanguage, email, absent, username } =
    counselorData;

  // just use needed data from whole form data
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
  }).then((response) => {
    if (response.status === 200) {
      return response.json();
    }
    return response.json();
  });
};

export default addCounselorData;

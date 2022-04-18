import { CounselorData } from "../../types/counselor";
import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";
import { counselorEndpoint } from "../../appConfig";
import { encodeUsername } from "../../utils/encryptionHelpers";
import deleteAgencyFromCounselor from "../agency/deleteAgencyFromCounselor";
import addAgencyToCounselor from "../agency/addAgencyToCounselor";

/**
 * edit counselor
 * @param counselorData - newly fetched consultant data from backend
 * @param formData - input data from form
 * @return data
 */
const editCounselorData = (
  counselorData: CounselorData,
  formData: CounselorData
) => {
  const {
    firstname,
    lastname,
    formalLanguage,
    email,
    absent,
    username,
    absenceMessage,
    id,
  } = formData;

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

  if (
    counselorData.agencyId !== null &&
    formData.agencyId !== null &&
    counselorData.agencyId !== formData.agencyId
  ) {
    deleteAgencyFromCounselor(counselorData.id, counselorData.agencyId).then(
      () => {
        addAgencyToCounselor(counselorData.id, formData.agencyId!);
      }
    );
  }

  return fetchData({
    url: `${counselorEndpoint}/${id}`,
    method: FETCH_METHODS.PUT,
    skipAuth: false,
    responseHandling: [FETCH_ERRORS.CATCH_ALL],
    bodyData: JSON.stringify(strippedCounselor),
  });
};

export default editCounselorData;

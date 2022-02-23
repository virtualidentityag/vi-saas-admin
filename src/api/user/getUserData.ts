import { customerEndpoint } from "../../appConfig";

import storeDispatch from "../../state/actions/storeDispatch";
import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";

/**
 * retrieve all needed user data and store them
 * this function mimics a default response to fail gracefully
 * and do not hinder the user
 */
const getUserData = () => {
  // retrieve customer
  const customerResponse = fetchData({
    url: customerEndpoint,
    method: FETCH_METHODS.GET,
    skipAuth: false,
    responseHandling: [FETCH_ERRORS.CATCH_ALL],
  });

  customerResponse.then((response: any) => {
    const { firstName, id, lastName, email, gender, salutation, phone } =
      response.data;

    if (response?.status !== 200) {
      return Promise.reject();
    }

    storeDispatch("user/set-data", {
      firstName,
      id,
      lastName,
      email,
      gender,
      salutation,
      phone,
    });

    return customerResponse;
  });
};

export default getUserData;

import { CancelTokenSource } from "axios";
import axiosWithAuth from "../axiosWithAuth";
import { customerEndpoint } from "../endpoints";

import storeDispatch from "../../state/actions/storeDispatch";

/**
 * retrieve all needed user data and store them
 * this function mimics a default response to fail gracefully
 * and do not hinder the user
 * @param cancelTokenSource {CancelTokenSource}
 */
const getUserData = (cancelTokenSource: CancelTokenSource) => {
  // retrieve customer
  const customerResponse = axiosWithAuth().get(customerEndpoint, {
    cancelToken: cancelTokenSource.token,
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

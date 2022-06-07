import { userDataEndpoint } from "../../appConfig";

import storeDispatch from "../../state/actions/storeDispatch";
import { FETCH_ERRORS, FETCH_METHODS, fetchData } from "../fetchData";

export const getUserData = async (): Promise<any> => {
  const userResponse = fetchData({
    url: userDataEndpoint,
    method: FETCH_METHODS.GET,
    skipAuth: false,
    responseHandling: [FETCH_ERRORS.CATCH_ALL],
  });

  userResponse.then((response: any) => {
    const { email, twoFactorAuth } = response;

    storeDispatch("user/set-data", {
      email,
      twoFactorAuth,
    });

    return userResponse;
  });
};

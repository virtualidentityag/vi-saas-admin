import { useMutation } from "react-query";
import { setTokens } from "../api/auth/auth";
import getAccessToken from "../api/auth/getAccessToken";

export const useLoginMutation = () => {
  return useMutation(
    ["login", "user-data"],
    async ({ username, password, otp }: any) => {
      return getAccessToken({ username, password, otp });
    },
    {
      onSuccess: (data) => {
        setTokens(
          data.access_token,
          data.expires_in,
          data.refresh_token,
          data.refresh_expires_in
        );
      },
    }
  );
};

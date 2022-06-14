import { useMutation } from "react-query";
import { setTokens } from "../api/auth/auth";
import getAccessToken from "../api/auth/getAccessToken";
import { TwoFactorType } from "../enums/TwoFactorType";
import { LoginData } from "../types/loginData";

interface Variables {
  username: string;
  password: string;
  otp: string;
}

interface Error {
  message: string;
  options: {
    data: { otpType: TwoFactorType };
  };
}

export const useLoginMutation = () => {
  return useMutation<LoginData, Error, Variables>(
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

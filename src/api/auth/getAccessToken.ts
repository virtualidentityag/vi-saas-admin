import { LoginData } from "../../types/loginData";
import { loginEndpoint } from "../../appConfig";

import { encodeUsername } from "../../utils/encryptionHelpers";
import { FETCH_ERRORS } from "../fetchData";

const getKeycloakAccessToken = (
  username: string,
  password: string,
  otp?: string
): Promise<LoginData> =>
  new Promise((resolve, reject) => {
    const dataBody = `username=${encodeUsername(
      username
    )}&password=${encodeURIComponent(password)}${
      otp ? `&otp=${otp}` : ``
    }&client_id=app&grant_type=password`;

    const req = new Request(loginEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
      },
      credentials: "include",
      body: dataBody,
    });

    fetch(req)
      .then((response) => {
        if (response.status === 200) {
          const dataResponse = response.json();
          resolve(dataResponse);
        } else if (response.status === 400) {
          reject(new Error(FETCH_ERRORS.BAD_REQUEST));
        } else if (response.status === 401) {
          reject(new Error(FETCH_ERRORS.UNAUTHORIZED));
        }
      })
      .catch(() => {
        reject(new Error("keycloakLogin"));
      });
  });

export default getKeycloakAccessToken;

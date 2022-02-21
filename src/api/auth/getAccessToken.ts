import axios from "axios";
import { loginEndpoint, XHRheader } from "../endpoints";

// Sends Login Post Request to Backend
const getAccessToken = async (username: string, password: string) =>
  axios
    .post(
      loginEndpoint,
      {
        username,
        password,
      },
      {
        headers: {
          "Accept-Language": XHRheader.AcceptLanguage,
        },
      }
    )
    .then((res) => {
      if (res.status !== 201 || !res?.data?.data?.attributes) {
        return Promise.reject(res);
      }

      return res;
    });

export default getAccessToken;

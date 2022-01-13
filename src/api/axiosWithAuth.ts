import axios from "axios";
import { XHRheader } from "./endpoints";
import { store } from "../store/store";

const axiosWithAuth = () => {
  const { tokenType, accessToken } = store.getState().auth;

  return axios.create({
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": XHRheader.AcceptLanguage,
      Authorization: `${tokenType} ${accessToken}`,
    },
  });
};

export default axiosWithAuth;

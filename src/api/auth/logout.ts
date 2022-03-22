import { removeAllCookies } from "./accessSessionCookie";
import apiKeycloakLogout from "./apiLogoutKeycloak";
import { removeTokenExpiryFromLocalStorage } from "./accessSessionLocalStorage";
import routePathNames from "../../appConfig";
import clearStore from "../../state/actions/clearStore";

let isRequestInProgress = false;

const redirectAfterLogout = (altRedirectUrl?: string) => {
  const redirectUrl = altRedirectUrl || routePathNames.login;
  setTimeout(() => {
    window.location.href = redirectUrl;
  }, 100);
};

const invalidateCookies = (withRedirect = true, redirectUrl?: string) => {
  removeAllCookies();
  removeTokenExpiryFromLocalStorage();
  if (withRedirect) {
    redirectAfterLogout(redirectUrl);
  }
};

const logout = (withRedirect = true, redirectUrl?: string) => {
  if (isRequestInProgress) {
    return null;
  }
  isRequestInProgress = true;

  apiKeycloakLogout()
    .then(() => {
      clearStore();
      invalidateCookies(withRedirect, redirectUrl);
    })
    .catch(() => {
      clearStore();
      invalidateCookies(withRedirect, redirectUrl);
    });
  return null;
};

export default logout;

import getLocationVariables from "./utils/getLocationVariables";

const REACT_APP_CSRF_WHITELIST_HEADER_PROPERTY =
  process.env.REACT_APP_CSRF_WHITELIST_HEADER_FOR_LOCAL_DEVELOPMENT;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const CSRF_WHITELIST_HEADER: string =
  REACT_APP_CSRF_WHITELIST_HEADER_PROPERTY;
const { subdomain, origin } = getLocationVariables();

let url = origin;

if (process.env.REACT_APP_USE_API_URL === "true") {
  url = `https://${process.env.REACT_APP_API_URL}`;
} else if (origin.includes("localhost")) {
  url = `https://${subdomain && `${subdomain}.`}${
    process.env.REACT_APP_API_URL
  }`;
}

export const mainURL = url;

export const XHRheader = { AcceptLanguage: "de" };
export const loginEndpoint = `${mainURL}/auth/realms/online-beratung/protocol/openid-connect/token`;
export const logoutEndpoint = `${mainURL}/auth/realms/online-beratung/protocol/openid-connect/logout`;
export const tenantEndpoint = `${mainURL}/service/tenant/`;
export const tenantPublicEndpoint = `${mainURL}/service/tenant/public/${subdomain}`;
export const counselorEndpoint = `${mainURL}/service/useradmin/consultants`;
export const counselorSearchEndpoint = `${mainURL}/service/user/consultants/search`;
export const agencyEndpoint = `${mainURL}/service/agencyadmin/agencies?page=1&perPage=10`;
export const customerEndpoint = `${mainURL}/customers`;

/*
 * routes
 */
const routePathNames = {
  root: "/admin",
  login: "/admin/login",
  themeSettings: "/admin/theme-settings",
  counselors: "/admin/berater/",
  counselorProfileEdit: "/admin/berater/bearbeiten/",
  counselorProfileAdd: "/admin/benutzer/anlegen/",
  userProfile: "/admin/profil/",
  termsAndConditions: "/admin/agb",
  imprint: "/impressum",
  privacy: "/datenschutz",
  tenants: "/admin/organisationen",
  loginResetPasswordLink:
    "/auth/realms/online-beratung/login-actions/reset-credentials?client_id=account",
};

export default routePathNames;

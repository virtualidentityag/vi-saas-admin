import getLocationVariables from "./utils/getLocationVariables";

process.env.REACT_APP_API_URL =
  process.env.REACT_APP_API_URL_FOR_LOCAL_DEVELOPMENT;
const REACT_APP_CSRF_WHITELIST_HEADER_PROPERTY =
  process.env.REACT_APP_CSRF_WHITELIST_HEADER_FOR_LOCAL_DEVELOPMENT;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const CSRF_WHITELIST_HEADER: string =
  REACT_APP_CSRF_WHITELIST_HEADER_PROPERTY;
export const apiUrlEnv: string = process.env.REACT_APP_API_URL || "";
export const apiUrl = process.env.REACT_APP_API_URL
  ? `https://${apiUrlEnv}`
  : "";

const { subdomain } = getLocationVariables();

export const mainURL = `https://${subdomain}.develop.onlineberatung.net`;
export const XHRheader = { AcceptLanguage: "de" };
export const loginEndpoint = `${mainURL}/auth/realms/online-beratung/protocol/openid-connect/token`;
export const logoutEndpoint = `${mainURL}/auth/realms/online-beratung/protocol/openid-connect/logout`;
export const tenantEndpoint = `${mainURL}/service/tenant/`;
export const counselorEndpoint = `${mainURL}/service/useradmin/consultants`;
export const agencyEndpoint = `${mainURL}/service/agencyadmin/agencies?page=1&perPage=10`;
export const customerEndpoint = `${mainURL}/customers`;

/*
 * routes
 */
const routePathNames = {
  root: "/admin/",
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
    "/auth/realms/caritas-online-beratung/login-actions/reset-credentials?client_id=account",
};

export default routePathNames;

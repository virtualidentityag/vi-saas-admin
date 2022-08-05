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

export const agencyDataAgencyId = `${mainURL}/service/agencyadmin/agencies/{agencyId}`;
export const agencyEndpoint = `${mainURL}/service/agencyadmin/agencies?page=1&perPage=100`;
export const agencyEndpointBase = `${mainURL}/service/agencyadmin/agencies`;
export const agencyEventTypes = `${mainURL}/service/appointservice/agencies/{agencyId}/eventTypes`;
export const agencyPostcodeRangeEndpointBase = `${mainURL}/service/agencyadmin/postcoderanges`;
export const consultantsForAgencyEndpoint = `${mainURL}/service/appointservice/agencies/{agencyId}/consultants`;
export const consultantsForAgencyEventTypes = `${mainURL}/service/appointservice/agencies/{agencyId}/eventTypes/{eventTypeId}/`;
export const consultantsForAgencyEventTypesNew = `${mainURL}/service/appointservice/agencies/{agencyId}/eventTypes`;
export const consultingTypeEndpoint = `${mainURL}/service/consultingtypes`;
export const counselorEndpoint = `${mainURL}/service/useradmin/consultants`;
export const customerEndpoint = `${mainURL}/customers`;
export const eventTypeById = `${mainURL}/eventTypes/{eventTypeId}`;
export const loginEndpoint = `${mainURL}/auth/realms/online-beratung/protocol/openid-connect/token`;
export const logoutEndpoint = `${mainURL}/auth/realms/online-beratung/protocol/openid-connect/logout`;
export const tenantEndpoint = `${mainURL}/service/tenant/`;
export const tenantPublicEndpoint = `${mainURL}/service/tenant/public/${subdomain}`;
export const topicEndpoint = `${mainURL}/service/topic`;
export const twoFactorAuth = `${mainURL}/service/users/2fa`;
export const twoFactorAuthApp = `${mainURL}/service/users/2fa/app`;
export const twoFactorAuthAppEmail = `${mainURL}/service/users/2fa/email`;
export const userDataEndpoint = `${mainURL}/service/users/data`;
export const usersConsultantsSearchEndpoint = `${mainURL}/service/users/consultants/search`;
export const XHRheader = { AcceptLanguage: "de" };

/*
 * routes
 */
const routePathNames = {
  root: "/admin",
  login: "/admin/login",
  themeSettings: "/admin/theme-settings",
  counselors: "/admin/counselor/",
  counselorProfileEdit: "/admin/counselor/edit/",
  counselorProfileAdd: "/admin/counselor/add/",
  agency: "/admin/agency/",
  agencyEdit: "/admin/agency/",
  agencyEditAllgemeines: "/admin/agency/:id/allgemeines",
  agencyEditErstberatung: "/admin/agency/:id/erstberatung",
  agencyAdd: "/admin/agency/add",
  topics: "/admin/topics",
  userProfile: "/admin/profil/",
  termsAndConditions: "/admin/agb",
  imprint: "/impressum",
  privacy: "/datenschutz",
  tenants: "/admin/organisationen",
  loginResetPasswordLink:
    "/auth/realms/online-beratung/login-actions/reset-credentials?client_id=account",
};

export default routePathNames;

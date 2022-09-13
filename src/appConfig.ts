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

export const clusterFeatureFlags = {
  useApiClusterSettings: true, // Feature flag to enable the cluster use the cluster settings instead of the config file
};

export const agencyDataAgencyId = (agencyId: string) =>
  `${mainURL}/service/agencyadmin/agencies/${agencyId}`;
export const agencyEndpoint = `${mainURL}/service/agencyadmin/agencies?page=1&perPage=100`;
export const agencyEndpointBase = `${mainURL}/service/agencyadmin/agencies`;
export const agencyEventTypes = (agencyId: string) =>
  `${mainURL}/service/appointservice/agencies/${agencyId}/eventTypes`;
export const agencyPostcodeRangeEndpointBase = `${mainURL}/service/agencyadmin/postcoderanges`;
export const consultantsHasAgencyEndpoint = (agencyId: string) =>
  `${mainURL}/service/useradmin/agencies/${agencyId}/consultants`;
export const consultantsForAgencyEndpoint = (agencyId: string) =>
  `${mainURL}/service/appointservice/agencies/${agencyId}/consultants`;
export const consultantsForAgencyEventTypes = (
  agencyId: string,
  eventTypeId: number
) =>
  `${mainURL}/service/appointservice/agencies/${agencyId}/eventTypes/${eventTypeId}/`;
export const consultantsForAgencyEventTypesNew = (agencyId: string) =>
  `${mainURL}/service/appointservice/agencies/${agencyId}/eventTypes`;
export const consultingTypeEndpoint = `${mainURL}/service/consultingtypes`;
export const counselorEndpoint = `${mainURL}/service/useradmin/consultants`;
export const eventTypeById = `${mainURL}/eventTypes/{eventTypeId}`;
export const loginEndpoint = `${mainURL}/auth/realms/online-beratung/protocol/openid-connect/token`;
export const logoutEndpoint = `${mainURL}/auth/realms/online-beratung/protocol/openid-connect/logout`;
export const tenantEndpoint = `${mainURL}/service/tenant/`;
export const serverSettingsEndpoint = `${mainURL}/service/settings`;
export const baseTenantPublicEndpoint = `${mainURL}/service/tenant/public`;
export const tenantPublicEndpoint = `${baseTenantPublicEndpoint}/${subdomain}`;
export const topicEndpoint = `${mainURL}/service/topic`;
export const twoFactorAuth = `${mainURL}/service/users/2fa`;
export const twoFactorAuthApp = `${mainURL}/service/users/2fa/app`;
export const twoFactorAuthAppEmail = `${mainURL}/service/users/2fa/email`;
export const userDataEndpoint = `${mainURL}/service/users/data`;
export const usersConsultantsSearchEndpoint = `${mainURL}/service/users/consultants/search`;
export const registrationDataEndpoint = `${mainURL}/service/users/statistics/registration`;
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
  agencyEdit: "/admin/agency/edit",
  agencyEditGeneral: "/admin/agency/edit/:id/general",
  agencyEditInitialMeeting: "/admin/agency/edit/:id/initial-meeting",
  agencyAdd: "/admin/agency/add",
  agencyAddGeneral: "/admin/agency/add/general",
  topics: "/admin/topics",
  statistic: "/admin/statistic",
  userProfile: "/admin/profil/",
  termsAndConditions: "/admin/agb",
  imprint: "/impressum",
  privacy: "/datenschutz",
  tenants: "/admin/organisationen",
  loginResetPasswordLink:
    "/auth/realms/online-beratung/login-actions/reset-credentials?client_id=account",
  appointmentServiceDevServer: "https://calcom-develop.suchtberatung.digital",
};

export default routePathNames;

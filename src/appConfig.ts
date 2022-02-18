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

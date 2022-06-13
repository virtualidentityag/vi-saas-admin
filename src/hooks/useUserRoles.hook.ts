import { getValueFromCookie } from "../api/auth/accessSessionCookie";
import { UserRole } from "../enums/UserRole";
import parseJwt from "../utils/parseJWT";

export const useUserRoles = (): [UserRole[], (role: UserRole) => boolean] => {
  const accessToken = getValueFromCookie("keycloak");
  let roles: UserRole[] = [];
  if (accessToken) {
    const access = parseJwt(accessToken || "");
    roles = access?.realm_access.roles || [];
  }

  return [
    roles,
    (userRole: UserRole) => roles.some((role: UserRole) => role === userRole),
  ];
};

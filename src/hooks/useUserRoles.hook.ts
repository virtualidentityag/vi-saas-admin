import { getValueFromCookie } from '../api/auth/accessSessionCookie';
import { UserRole } from '../enums/UserRole';
import parseJwt from '../utils/parseJWT';

export const useUserRoles = (): {
    roles: UserRole[];
    hasRole: (role: UserRole | UserRole[]) => boolean;
    isSuperAdmin: boolean;
} => {
    const accessToken = getValueFromCookie('keycloak');
    const payload = parseJwt(accessToken);
    const roles: UserRole[] = payload?.realm_access.roles || [];

    const hasRole = (userRole: UserRole | UserRole[]) => {
        const userRoles = Array.isArray(userRole) ? userRole : [userRole];
        return roles.some((role: UserRole) => userRoles.includes(role));
    };

    const isSuperAdmin = hasRole(UserRole.AgencyAdmin) && hasRole(UserRole.TenantAdmin) && payload?.tenantId === 0;

    return { roles, hasRole, isSuperAdmin };
};

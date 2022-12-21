import merge from 'lodash.merge';
import { useAppConfigContext } from '../context/useAppConfig';
import { UserRole } from '../enums/UserRole';
import { useUserRoles } from '../hooks/useUserRoles.hook';
import { UserPermissions } from '../types/UserPermission';

const rolesPriority: UserRole[] = [
    UserRole.AgencyAdmin,
    UserRole.TopicAdmin,
    UserRole.UserAdmin,
    UserRole.SingleTenantAdmin,
    UserRole.RestrictedAgencyAdmin,
    UserRole.TenantAdmin,
];

export const useUserRolesToPermission = () => {
    const [userRoles] = useUserRoles();
    const { settings } = useAppConfigContext();
    const singleCanEditLegalText =
        !settings.multitenancyWithSingleDomainEnabled || settings.legalContentChangesBySingleTenantAdminsAllowed;

    const permissions: Record<Partial<UserRole>, UserPermissions> = {
        [UserRole.RestrictedAgencyAdmin]: {
            Consultant: { delete: false },
            Statistic: { read: false },
            Agency: { read: true, create: false, update: true, delete: false },
            Admin: { read: false, create: false, update: false, delete: false },
        },
        [UserRole.AgencyAdmin]: {
            Agency: { read: true, create: true, update: true, delete: true },
        },
        [UserRole.TenantAdmin]: {
            Tenant: { read: true, update: true },
            LegalText: { read: true, update: true },
            Statistic: { read: true },
        },
        [UserRole.TopicAdmin]: {
            Topic: { read: true, create: true, update: true, delete: true },
        },
        [UserRole.SingleTenantAdmin]: {
            Tenant: { read: true, update: true },
            LegalText: {
                read: singleCanEditLegalText,
                update: singleCanEditLegalText,
            },
            Statistic: { read: true },
        },
        [UserRole.UserAdmin]: {
            Consultant: { read: true, create: true, update: true, delete: true },
            Admin: { read: true, create: true, update: true, delete: true },
        },
    };

    return rolesPriority
        .filter((role) => userRoles.includes(role))
        .reduce((current, role) => merge(current, permissions[role] || {}), {} as UserPermissions);
};

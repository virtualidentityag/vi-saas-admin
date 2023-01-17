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
    const isMultiTenancyWithSingleDomain = settings.multitenancyWithSingleDomainEnabled;

    const permissions: Record<Partial<UserRole>, UserPermissions> = {
        [UserRole.RestrictedAgencyAdmin]: {
            Consultant: { delete: false },
            Statistic: { read: false },
            Agency: { read: true, create: false, update: true, delete: false },
            AgencyAdminUser: { read: false, create: false, update: false, delete: false },
        },
        [UserRole.AgencyAdmin]: {
            Agency: { read: true, create: true, update: true, delete: true },
        },
        [UserRole.TenantAdmin]: {
            Tenant: { read: true, update: true, create: true, delete: true },
            Language: { update: true },
            LegalText: { read: true, update: true },
            Statistic: { read: true },
            TenantAdminUser: { read: true, create: true, update: true, delete: true },
        },
        [UserRole.TopicAdmin]: {
            Topic: { read: true, create: true, update: true, delete: true },
        },
        [UserRole.SingleTenantAdmin]: {
            Tenant: { read: !isMultiTenancyWithSingleDomain, update: !isMultiTenancyWithSingleDomain },
            Language: { update: !settings.multitenancyWithSingleDomainEnabled },
            LegalText: {
                read: singleCanEditLegalText,
                update: singleCanEditLegalText,
            },
            Statistic: { read: true },
        },
        [UserRole.UserAdmin]: {
            Consultant: { read: true, create: true, update: true, delete: true },
            AgencyAdminUser: { read: true, create: true, update: true, delete: true },
        },
    };

    return rolesPriority
        .filter((role) => userRoles.includes(role))
        .reduce((current, role) => merge(current, permissions[role] || {}), {} as UserPermissions);
};

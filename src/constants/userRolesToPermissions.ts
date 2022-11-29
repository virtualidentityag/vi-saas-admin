import { UserRole } from '../enums/UserRole';
import { UserPermissions } from '../types/UserPermission';

export const userRolesToPermission: Record<Partial<UserRole>, UserPermissions> = {
    [UserRole.RestrictedAgencyAdmin]: {
        Consultant: { read: true, create: true, update: true, delete: false },
        Admin: { read: false, create: false, update: false, delete: false },
    },
    [UserRole.AgencyAdmin]: {
        Agency: { read: true, create: true, update: true, delete: true },
        Consultant: { read: true, create: true, update: true, delete: false },
        Admin: { read: true, create: false, update: false, delete: false },
    },
    [UserRole.TenantAdmin]: {
        Consultant: { read: true, create: true, update: true, delete: true },
        Admin: { read: true, create: false, update: true, delete: true },
        Statistic: { read: true },
    },
    [UserRole.TopicAdmin]: {
        Topic: { read: true, create: true, update: true, delete: true },
    },
    [UserRole.SingleTenantAdmin]: {
        Agency: { read: true, create: true, update: true, delete: true },
        Consultant: { read: true, create: true, update: true, delete: true },
        Statistic: { read: true },
    },
    [UserRole.UserAdmin]: {},
};

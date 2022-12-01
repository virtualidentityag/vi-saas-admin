import { useMemo } from 'react';
import { PermissionAction } from '../enums/PermissionAction';
import { Resource } from '../enums/Resource';
import { UserPermissions } from '../types/UserPermission';
import { useUserRoles } from './useUserRoles.hook';
import { userRolesToPermission } from '../constants/userRolesToPermissions';

interface UserPermissionsReturn {
    permissions: UserPermissions;
    can: (action: PermissionAction | PermissionAction[], resource: Resource) => boolean;
}

export const useUserPermissions = (): UserPermissionsReturn => {
    const [roles] = useUserRoles();
    const userPermissions = useMemo(() => userRolesToPermission(roles), [roles]);

    return {
        permissions: userPermissions,
        can: (action: PermissionAction | PermissionAction[], resource: Resource) => {
            const actions = action instanceof Array ? action : [action];
            return actions.some((tmpAction) => userPermissions?.[Resource[resource]]?.[tmpAction] || false);
        },
    };
};

import { PermissionAction } from '../enums/PermissionAction';
import { Resource } from '../enums/Resource';
import { UserPermissions } from '../types/UserPermission';
import { useUserRolesToPermission } from '../constants/userRolesToPermissions';

interface UserPermissionsReturn {
    permissions: UserPermissions;
    can: (action: PermissionAction | PermissionAction[], resource: Resource) => boolean;
}

export const useUserPermissions = (): UserPermissionsReturn => {
    const userPermissions = useUserRolesToPermission();

    return {
        permissions: userPermissions,
        can: (action: PermissionAction | PermissionAction[], resource: Resource) => {
            const actions = action instanceof Array ? action : [action];
            return actions.some((tmpAction) => userPermissions?.[Resource[resource]]?.[tmpAction] || false);
        },
    };
};

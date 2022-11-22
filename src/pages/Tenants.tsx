import React from 'react';
import { Navigate } from 'react-router-dom';
import TenantsList from '../components/TenantList/TenantsList';
import routePathNames from '../appConfig';
import { useUserRoles } from '../hooks/useUserRoles.hook';
import { UserRole } from '../enums/UserRole';

export const Tenants = () => {
    const [, hasRole] = useUserRoles();

    return !hasRole(UserRole.TenantAdmin) ? (
        <Navigate to={routePathNames.themeSettings} />
    ) : (
        <div>
            <TenantsList />
        </div>
    );
};

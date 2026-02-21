import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, Flex } from 'antd';
import Stage from './Stage';
import PublicPageLayoutWrapper from '../../components/Layout/PublicPageLayoutWrapper';
import LoginForm from './LoginForm';
import routePathNames from '../../appConfig';
import { getValueFromCookie } from '../../api/auth/accessSessionCookie';
import { getTokenExpiryFromLocalStorage } from '../../api/auth/accessSessionLocalStorage';
import { useUserRoles } from '../../hooks/useUserRoles.hook';
import { usePublicTenantData } from '../../hooks/usePublicTenantData.hook';
import { UserRole } from '../../enums/UserRole';
import { useAppConfigContext } from '../../context/useAppConfig';

export const Login = () => {
    const { settings } = useAppConfigContext();
    const accessToken = getValueFromCookie('keycloak');
    const currentTime = new Date().getTime();
    const tokenExpiry = getTokenExpiryFromLocalStorage();
    const { data: tenantData } = usePublicTenantData();
    const { hasRole } = useUserRoles();
    const accessTokenValidInMs = tokenExpiry.accessTokenValidUntilTime - currentTime;
    const refreshTokenValidInMs = tokenExpiry.refreshTokenValidUntilTime - currentTime;

    const [redirectUrl, setRedirectUrl] = useState('');

    useEffect(() => {
        if (hasRole(UserRole.TenantAdmin) && accessToken && refreshTokenValidInMs > 0 && accessTokenValidInMs > 0) {
            setRedirectUrl(routePathNames.tenants);
        } else if (accessToken && refreshTokenValidInMs > 0 && accessTokenValidInMs > 0 && tenantData) {
            const redirectPath =
                (settings.mainTenantSubdomainForSingleDomainMultitenancy && hasRole(UserRole.TenantAdmin)) ||
                !settings.mainTenantSubdomainForSingleDomainMultitenancy
                    ? routePathNames.themeSettings
                    : routePathNames.consultants;
            setRedirectUrl(redirectPath);
        }
    }, [accessToken, accessTokenValidInMs, refreshTokenValidInMs, tenantData, hasRole(UserRole.TenantAdmin)]);

    if (redirectUrl) {
        return <Navigate to={redirectUrl} />;
    }

    return (
        <PublicPageLayoutWrapper hideFooter>
            <Flex
                vertical
                align="center"
                justify="center"
                style={{ minHeight: '100vh', background: '#f5f5f5', padding: 24 }}
            >
                <Card style={{ width: '100%', maxWidth: 420 }} variant="borderless">
                    <Stage />
                    <div style={{ padding: '0 24px 24px' }}>
                        <LoginForm />
                    </div>
                </Card>
            </Flex>
        </PublicPageLayoutWrapper>
    );
};

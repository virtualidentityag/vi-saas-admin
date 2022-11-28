import { useEffect } from 'react';
import './styles/App.less';
import { Route, Routes, useLocation, useNavigate } from 'react-router';
import ProtectedPageLayoutWrapper from './components/Layout/ProtectedPageLayoutWrapper';
import routePathNames from './appConfig';
// import Dashboard from "./pages/Dashboard";
import { TenantSettings } from './pages/TenantSettings';
import { Topics } from './pages/Topics';
import { Statistic } from './pages/Statistic';
import { UserProfile } from './pages/UserProfile';
import { Tenants } from './pages/Tenants';
import { Initialization } from './components/Layout/Initialization';
import { Agencies } from './pages/Agencies';
import { useTenantData } from './hooks/useTenantData.hook';
import { FeatureProvider } from './context/FeatureContext';
import { AgencyPageEdit } from './pages/AgencyEdit';
import { AgencyAdd } from './pages/AgencyAdd';
import { useAppConfigContext } from './context/useAppConfig';
import { useUserRoles } from './hooks/useUserRoles.hook';
import { UserRole } from './enums/UserRole';
import { UsersList } from './pages/users/List';
import { UserEditOrAdd } from './pages/users/Edit';

export const App = () => {
    const { settings } = useAppConfigContext();
    const [, hasRole] = useUserRoles();
    const { isLoading, data } = useTenantData();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === routePathNames.root || location.pathname === `${routePathNames.root}/`) {
            const redirectPath =
                (settings.mainTenantSubdomainForSingleDomainMultitenancy && hasRole(UserRole.TenantAdmin)) ||
                !settings.mainTenantSubdomainForSingleDomainMultitenancy
                    ? routePathNames.themeSettings
                    : routePathNames.consultants;
            navigate(redirectPath);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return isLoading ? (
        <Initialization />
    ) : (
        <FeatureProvider tenantData={data}>
            <ProtectedPageLayoutWrapper>
                <Routes>
                    {/* later <Route path="/" element={<Dashboard />} /> */}
                    <Route path={routePathNames.themeSettings} element={<TenantSettings />} />
                    <Route path={routePathNames.agency} element={<Agencies />} />
                    <Route path={`${routePathNames.agencyEdit}/*`} element={<AgencyPageEdit />} />
                    <Route path={`${routePathNames.agencyAdd}/*`} element={<AgencyAdd />} />
                    <Route path={routePathNames.topics} element={<Topics />} />
                    <Route path={routePathNames.statistic} element={<Statistic />} />
                    <Route path={routePathNames.userProfile} element={<UserProfile />} />
                    <Route path={routePathNames.tenants} element={<Tenants />} />
                    <Route path="/admin/users/:typeOfUsers" element={<UsersList />} />
                    <Route path="/admin/users/:typeOfUsers/:id" element={<UserEditOrAdd />} />
                </Routes>
            </ProtectedPageLayoutWrapper>
        </FeatureProvider>
    );
};

import React, { useEffect, useMemo } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Layout, Menu, MenuProps } from 'antd';
import {
    SettingOutlined,
    TeamOutlined,
    UserOutlined,
    BankOutlined,
    TagsOutlined,
    BarChartOutlined,
    ProfileOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import routePathNames from '../../appConfig';
import SiteHeader from './SiteHeader';
import { handleTokenRefresh } from '../../api/auth/auth';
import logout from '../../api/auth/logout';
import getLocationVariables from '../../utils/getLocationVariables';
import { useUserRoles } from '../../hooks/useUserRoles.hook';
import { useTenantData } from '../../hooks/useTenantData.hook';
import { UserRole } from '../../enums/UserRole';
import { useFeatureContext } from '../../context/FeatureContext';
import { FeatureFlag } from '../../enums/FeatureFlag';
import { useAppConfigContext } from '../../context/useAppConfig';
import { PermissionAction } from '../../enums/PermissionAction';
import { Resource } from '../../enums/Resource';
import { useUserPermissions } from '../../hooks/useUserPermission';
import LogoSvg from '../../resources/img/logo-connecta.svg?react';
import styles from './styles.module.scss';

const { Content, Sider } = Layout;

const ProtectedPageLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const { settings } = useAppConfigContext();
    const { can } = useUserPermissions();
    const { subdomain } = getLocationVariables();
    const { hasRole } = useUserRoles();
    const { data: tenantData } = useTenantData();
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const { isEnabled, toggleFeature } = useFeatureContext();
    const [searchParams] = useSearchParams();
    const developer = searchParams.get('developer');

    useEffect(() => {
        handleTokenRefresh();
        if (!isEnabled(FeatureFlag.Developer) && developer === 'true') {
            toggleFeature(FeatureFlag.Developer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const isLocalhost = window.location.origin.includes('localhost');
        if (!isLocalhost && subdomain !== tenantData.subdomain && !settings.multitenancyWithSingleDomainEnabled) {
            logout(true);
        }
    }, [subdomain, tenantData.subdomain]);

    const handleLogout = () => {
        logout(true);
    };

    const usersPage = () => {
        if (can(PermissionAction.Read, Resource.Consultant)) return routePathNames.consultants;
        if (can(PermissionAction.Read, Resource.AgencyAdminUser)) return routePathNames.agencyAdmins;
        return routePathNames.tenantAdmins;
    };

    const menuItems = useMemo(() => {
        const items: MenuProps['items'] = [];

        if (can(PermissionAction.Read, Resource.Tenant) || can(PermissionAction.Read, Resource.LegalText)) {
            items.push({
                key: routePathNames.themeSettings,
                icon: <SettingOutlined />,
                label: t('settings.title'),
            });
        }

        if (can(PermissionAction.Create, Resource.Tenant)) {
            items.push({
                key: routePathNames.tenants,
                icon: <BankOutlined />,
                label: t('tenants.navTitle'),
            });
        }

        if (
            can(PermissionAction.Read, Resource.Consultant) ||
            can(PermissionAction.Read, Resource.AgencyAdminUser) ||
            can(PermissionAction.Read, Resource.TenantAdminUser)
        ) {
            items.push({
                key: '/admin/users',
                icon: <TeamOutlined />,
                label: t('users.title'),
            });
        }

        if (can(PermissionAction.Read, Resource.Agency)) {
            items.push({
                key: routePathNames.agency,
                icon: <ProfileOutlined />,
                label: t('agency'),
            });
        }

        if (can(PermissionAction.Read, Resource.Topic) && isEnabled(FeatureFlag.Topics)) {
            items.push({
                key: routePathNames.topics,
                icon: <TagsOutlined />,
                label: t('topics.title'),
            });
        }

        if (can(PermissionAction.Read, Resource.Statistic)) {
            items.push({
                key: routePathNames.statistic,
                icon: <BarChartOutlined />,
                label: t('statistic.title'),
            });
        }

        items.push({
            key: routePathNames.userProfile,
            icon: <UserOutlined />,
            label: t('profile.title'),
        });

        return items;
    }, [can, isEnabled, t]);

    const selectedKeys = useMemo(() => {
        const path = location.pathname;
        const match = menuItems.find((item) => path.startsWith(String(item.key)));
        return match ? [String(match.key)] : [];
    }, [location.pathname, menuItems]);

    const handleMenuClick = ({ key }: { key: string }) => {
        if (key === '/admin/users') {
            navigate(usersPage());
        } else {
            navigate(key);
        }
    };

    return (
        <>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    width={220}
                    theme="dark"
                    breakpoint="md"
                    collapsedWidth={60}
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'sticky',
                        top: 0,
                        left: 0,
                        background: '#273270',
                    }}
                >
                    <div
                        style={{
                            height: 56,
                            margin: '16px 16px 8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <LogoSvg style={{ width: 150, height: 'auto', filter: 'brightness(0) invert(1)' }} />
                    </div>
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={selectedKeys}
                        items={menuItems}
                        onClick={handleMenuClick}
                        style={{ borderRight: 'none' }}
                    />
                    <div style={{ position: 'absolute', bottom: 0, width: '100%' }}>
                        <Menu
                            theme="dark"
                            mode="inline"
                            selectable={false}
                            style={{ borderRight: 'none' }}
                            items={[
                                {
                                    key: 'logout',
                                    icon: <LogoutOutlined />,
                                    label: t('logout'),
                                    onClick: handleLogout,
                                },
                            ]}
                        />
                    </div>
                </Sider>

                <Layout style={{ background: '#f8ede3' }}>
                    <SiteHeader />
                    <Content className={styles.content}>{children}</Content>
                    {!hasRole(UserRole.TenantAdmin) && (
                        <Layout.Footer
                            style={{
                                textAlign: 'center',
                                padding: '12px 24px',
                                background: '#f8ede3',
                                borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                            }}
                        >
                            <a
                                href={routePathNames.imprint}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#273270' }}
                            >
                                {t('footer.label.imprint')}
                            </a>
                            {' | '}
                            <a
                                href={routePathNames.privacy}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#273270' }}
                            >
                                {t('footer.label.privacy')}
                            </a>
                        </Layout.Footer>
                    )}
                </Layout>
            </Layout>
            {isEnabled(FeatureFlag.Developer) && <ReactQueryDevtools />}
        </>
    );
};

export default ProtectedPageLayoutWrapper;

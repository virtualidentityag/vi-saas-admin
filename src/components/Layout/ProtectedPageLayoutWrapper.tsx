import { useEffect } from "react";
import { ReactQueryDevtools } from "react-query/devtools";
import { Layout } from "antd";
import { NavLink, useSearchParams } from "react-router-dom";
import {
  // DesktopOutlined,
  SettingOutlined,
  TeamOutlined,
  BankOutlined,
  ShopOutlined,
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import routePathNames from "../../appConfig";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import CustomLogoutIcon from "../CustomIcons/Logout";
import { handleTokenRefresh } from "../../api/auth/auth";
import logout from "../../api/auth/logout";
import getLocationVariables from "../../utils/getLocationVariables";
import { useUserRoles } from "../../hooks/useUserRoles.hook";
import { useTenantData } from "../../hooks/useTenantData.hook";
import { UserRole } from "../../enums/UserRole";
import { useFeatureContext } from "../../context/FeatureContext";

const { Content, Sider } = Layout;

function ProtectedPageLayoutWrapper({ children }: any) {
  const { subdomain } = getLocationVariables();
  const [, hasRole] = useUserRoles();
  const { data: tenantData } = useTenantData();
  const { t } = useTranslation();
  const handleLogout = () => {
    logout(true);
  };
  const { isEnabled, toggleFeature } = useFeatureContext();
  const [searchParams] = useSearchParams();
  // add this to url to enable developer mode -> ?godmode=true
  const developer = searchParams.get("godmode");

  useEffect(() => {
    // handle a refresh as registered user and not initialize a new user
    handleTokenRefresh();

    if (!isEnabled("developer") && developer === "true") {
      toggleFeature("developer");
    }
  }, []);

  useEffect(() => {
    if (subdomain !== tenantData.subdomain) {
      logout(true);
    }
  }, [subdomain, tenantData.subdomain]);

  return (
    <>
      <Layout className="protectedLayout">
        <Sider width={96}>
          <div className="logo" />
          <nav className="mainMenu">
            <ul>
              {!hasRole(UserRole.TenantAdmin) ? (
                <>
                  <li key="2" className="menuItem">
                    <NavLink
                      to={routePathNames.themeSettings}
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <SettingOutlined className="menuIcon" />
                      <span>{t("settings.title")}</span>
                    </NavLink>
                  </li>

                  <li key="3" className="menuItem">
                    <NavLink
                      to={routePathNames.counselors}
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <TeamOutlined className="menuIcon" />
                      <span>{t("counselor.title")}</span>
                    </NavLink>
                  </li>
                  <li key="4" className="menuItem">
                    <NavLink
                      to={routePathNames.agency}
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <ShopOutlined className="menuIcon" />
                      <span>{t("agency")}</span>
                    </NavLink>
                  </li>

                  {hasRole(UserRole.TopicAdmin) && (
                    <li key="5" className="menuItem">
                      <NavLink
                        to={routePathNames.topics}
                        className={({ isActive }) => (isActive ? "active" : "")}
                      >
                        <FileTextOutlined className="menuIcon" />
                        <span>{t("topics.title")}</span>
                      </NavLink>
                    </li>
                  )}
                  <li key="6" className="menuItem">
                    <NavLink
                      to={routePathNames.userProfile}
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <UserOutlined className="menuIcon" />
                      <span>{t("profile.title")}</span>
                    </NavLink>
                  </li>
                </>
              ) : (
                <li key="6" className="menuItem">
                  <NavLink
                    to={routePathNames.tenants}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <BankOutlined className="menuIcon" />
                    <span>{t("organisations.title")}</span>
                  </NavLink>
                </li>
              )}

              <li key="999" className="menuItem">
                <button onClick={handleLogout} type="button">
                  <CustomLogoutIcon className="menuIcon" />
                  <span className="logout">{t("logout")}</span>
                </button>
              </li>
            </ul>
          </nav>
        </Sider>
        <Layout className="mainContent">
          <SiteHeader />
          <Content className="content">
            <div className="contentInner">{children}</div>
          </Content>
          {!hasRole(UserRole.TenantAdmin) && <SiteFooter />}
        </Layout>
      </Layout>
      {isEnabled("developer") && <ReactQueryDevtools />}
    </>
  );
}

export default ProtectedPageLayoutWrapper;

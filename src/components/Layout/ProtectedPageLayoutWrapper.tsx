import { useEffect } from "react";
import { ReactQueryDevtools } from "react-query/devtools";
import { Layout } from "antd";
import { NavLink, useSearchParams } from "react-router-dom";
import {
  // DesktopOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import routePathNames from "../../appConfig";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import { handleTokenRefresh } from "../../api/auth/auth";
import logout from "../../api/auth/logout";
import getLocationVariables from "../../utils/getLocationVariables";
import { useUserRoles } from "../../hooks/useUserRoles.hook";
import { useTenantData } from "../../hooks/useTenantData.hook";
import { UserRole } from "../../enums/UserRole";
import { useFeatureContext } from "../../context/FeatureContext";
import { NavIcon } from "./NavIcon";

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
  // add this to url to enable developer mode -> ?developer=true
  const developer = searchParams.get("developer");

  useEffect(() => {
    // handle a refresh as registered user and not initialize a new user
    handleTokenRefresh();

    if (!isEnabled("developer") && developer === "true") {
      toggleFeature("developer");
    }
  }, []);

  // initially check database value of topics feature toggle and write it into context state
  useEffect(() => {
    if (
      !!tenantData.settings.topicsInRegistrationEnabled !== isEnabled("topics")
    ) {
      toggleFeature("topics");
    }
  }, [tenantData?.settings.topicsInRegistrationEnabled, isEnabled("topics")]);

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
                      <NavIcon path={routePathNames.themeSettings} />
                      <span>{t("settings.title")}</span>
                    </NavLink>
                  </li>

                  <li key="3" className="menuItem">
                    <NavLink
                      to={routePathNames.counselors}
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <NavIcon path={routePathNames.counselors} />
                      <span>{t("counselor.title")}</span>
                    </NavLink>
                  </li>
                  <li key="4" className="menuItem">
                    <NavLink
                      to={routePathNames.agency}
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <NavIcon path={routePathNames.agency} />
                      <span>{t("agency")}</span>
                    </NavLink>
                  </li>

                  {hasRole(UserRole.TopicAdmin) && (
                    <li key="5" className="menuItem">
                      <NavLink
                        to={routePathNames.topics}
                        className={({ isActive }) => (isActive ? "active" : "")}
                      >
                        <NavIcon path={routePathNames.topics} />
                        <span>{t("topics.title")}</span>
                      </NavLink>
                    </li>
                  )}
                  <li key="6" className="menuItem">
                    <NavLink
                      to={routePathNames.userProfile}
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <NavIcon path={routePathNames.userProfile} />
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
                  <NavIcon path="logout" />
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

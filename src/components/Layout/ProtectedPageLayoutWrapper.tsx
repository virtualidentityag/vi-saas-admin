import React from "react";
import { Layout } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FileOutlined,
  LogoutOutlined,
  TeamOutlined,
  UserOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import routePathNames from "../../appConfig";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import clearStore from "../../state/actions/clearStore";

const { Content, Sider } = Layout;

function ProtectedPageLayoutWrapper({ children }: any) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const logout = () => {
    clearStore();
    navigate("/login");
  };

  return (
    <Layout className="protectedLayout">
      <Sider width={140}>
        <div className="logo" />
        <nav className="mainMenu">
          <ul>
            {/* later..... <li key="1" className="menuItem">
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <DesktopOutlined className="menuIcon" />
                <span>Dashboard</span>
              </NavLink>
            </li> */}

            <li key="2" className="menuItem">
              <NavLink
                to={routePathNames.themeSettings}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FileOutlined className="menuIcon" />
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
                to={routePathNames.tenants}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <BankOutlined className="menuIcon" />
                <span>{t("organisation.title")}</span>
              </NavLink>
            </li>

            <li key="5" className="menuItem">
              <NavLink
                to={routePathNames.userProfile}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <UserOutlined className="menuIcon" />
                <span>{t("profile.title")}</span>
              </NavLink>
            </li>

            <li key="6" className="menuItem">
              <button onClick={logout} type="button">
                <LogoutOutlined className="menuIcon" />
                <span>{t("logout")}</span>
              </button>
            </li>
          </ul>
        </nav>
      </Sider>
      <Layout>
        <SiteHeader />
        <Content style={{ margin: "0 16px" }}>
          <div style={{ padding: 24, minHeight: 360 }}>{children}</div>
        </Content>
        <SiteFooter />
      </Layout>
    </Layout>
  );
}

export default ProtectedPageLayoutWrapper;

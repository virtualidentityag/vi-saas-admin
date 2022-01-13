import React from "react";
import { Layout } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import {
  DesktopOutlined,
  FileOutlined,
  LogoutOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { routePathNames } from "../../appConfig";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import clearStore from "../../state/actions/clearStore";

const { Content } = Layout;

function ProtectedPageLayoutWrapper({ children }: any) {
  const navigate = useNavigate();
  const logout = () => {
    clearStore();
    navigate("/login");
  };

  return (
    <Layout className="protectedLayout">
      <aside>
        <div className="logo" />
        <nav className="mainMenu">
          <ul>
            <li key="1" className="menuItem">
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <DesktopOutlined className="menuIcon" />
                <span>Dashboard</span>
              </NavLink>
            </li>

            <li key="2" className="menuItem">
              <NavLink
                to={routePathNames.themeSettings}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FileOutlined className="menuIcon" />
                <span>Settings</span>
              </NavLink>
            </li>

            <li key="3" className="menuItem">
              <NavLink
                to={routePathNames.counselors}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <TeamOutlined className="menuIcon" />
                <span>Berater</span>
              </NavLink>
            </li>

            <li key="4" className="menuItem">
              <NavLink
                to={routePathNames.userProfile}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <UserOutlined className="menuIcon" />
                <span>Profil</span>
              </NavLink>
            </li>

            <li key="5" className="menuItem">
              <button onClick={logout} type="button">
                <LogoutOutlined className="menuIcon" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <Layout className="siteLayout">
        <SiteHeader />
        <Content style={{ margin: "0 16px" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            {children}
          </div>
        </Content>
        <SiteFooter />
      </Layout>
    </Layout>
  );
}

export default ProtectedPageLayoutWrapper;

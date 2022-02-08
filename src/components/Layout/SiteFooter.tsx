import React from "react";
import { Menu } from "antd";
import MenuItem from "antd/es/menu/MenuItem";
import { NavLink } from "react-router-dom";
import { Footer } from "antd/es/layout/layout";
import { useTranslation } from "react-i18next";
import routePathNames from "../../appConfig";

function SiteFooter() {
  const { t } = useTranslation();
  return (
    <Footer className="layoutFooter">
      <Menu mode="horizontal" className="footerMenu">
        <MenuItem key="1">
          <NavLink
            to={routePathNames.imprint}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span>{t("imprint")}</span>
          </NavLink>
        </MenuItem>
        <MenuItem key="2"> | </MenuItem>
        <MenuItem key="3">
          <NavLink
            to={routePathNames.privacy}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span>{t("privacy")}</span>
          </NavLink>
        </MenuItem>
      </Menu>
    </Footer>
  );
}

export default SiteFooter;

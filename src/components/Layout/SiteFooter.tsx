import React from "react";
import { Menu } from "antd";
import MenuItem from "antd/es/menu/MenuItem";
import { NavLink } from "react-router-dom";
import { Footer } from "antd/es/layout/layout";

function SiteFooter() {
  return (
    <Footer className="layoutFooter">
      <Menu mode="horizontal" className="footerMenu">
        <MenuItem key="1">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span>Impressum</span>
          </NavLink>
        </MenuItem>
        <MenuItem key="2"> | </MenuItem>
        <MenuItem key="3">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span>Datenschutz</span>
          </NavLink>
        </MenuItem>
      </Menu>
    </Footer>
  );
}

export default SiteFooter;

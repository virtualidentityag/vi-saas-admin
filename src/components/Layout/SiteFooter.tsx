import React from "react";
import { Menu } from "antd";
import MenuItem from "antd/es/menu/MenuItem";

import { Footer } from "antd/es/layout/layout";
import { useTranslation } from "react-i18next";
import routePathNames from "../../appConfig";

/*
 * ATTENTION: these links will not work on local maschines.
 * to make them work on LIVE/DEV they link to a route "outside / above" the scope of of this admin console,
 * but on the same host.
 * locally we have 2 seperated repos / applications
 * example:
 * https://tenant1.onlineberatung.net/impressum is the Imprint page
 * https://tenant1.onlineberatung.net/admin/settings ist the admin console settings page
 *
 */

function SiteFooter() {
  const { t } = useTranslation();
  return (
    <Footer className="layoutFooter">
      <Menu mode="horizontal" className="footerMenu">
        <MenuItem key="1">
          <a
            href={routePathNames.imprint}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{t("imprint")}</span>
          </a>
        </MenuItem>
        <MenuItem key="2"> | </MenuItem>
        <MenuItem key="3">
          <a
            href={routePathNames.privacy}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{t("privacy")}</span>
          </a>
        </MenuItem>
      </Menu>
    </Footer>
  );
}

export default SiteFooter;

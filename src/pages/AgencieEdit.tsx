import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router";
import { ReactComponent as ChevronLeft } from "../resources/img/svg/chevron-left.svg";
import AgencieEditAllgemeines from "../components/Agency/AgencieEditAllgemeines";
import AgencieEditErstberatung from "../components/Agency/AgencieEditErstberatung";
import agencyRoutes from "../components/Agency/Agency.routes";
import routePathNames from "../appConfig";

function AgencieEdit() {
  const { t } = useTranslation();
  const currentPath = useLocation().pathname;
  const [agencyEditComponent, setAgencyEditComponent] = useState(null);
  const [, agencyId] = currentPath.match(/.*\/([^/]+)\/[^/]+/);

  useEffect(() => {
    switch (currentPath.replace(agencyId, ":id")) {
      case routePathNames.agencyEditAllgemeines:
        setAgencyEditComponent(<AgencieEditAllgemeines />);
        break;

      case routePathNames.agencyEditErstberatung:
        setAgencyEditComponent(<AgencieEditErstberatung />);
        break;

      default:
        break;
    }
  }, [currentPath]);

  return (
    <React.Fragment>
      <div className="agencyEdit__header">
        <div className="agencyEdit__headerBack">
          <NavLink to="/admin/agency/">
            <ChevronLeft />
            <h3 className="agencyEdit__header--headline">
              {t("agency.edit.allgemeines.headline")}
            </h3>
          </NavLink>
        </div>
        <div className="agencyEdit__nav">
          {agencyRoutes.map((tab) => (
            <div key={tab.url} className="agencyEdit__navItem">
              <NavLink
                to={`/admin/agency/${agencyId}${tab.url}`}
                className={({ isActive }) => {
                  return isActive ? "active" : "";
                }}
              >
                {tab.title}
              </NavLink>
            </div>
          ))}
        </div>
      </div>
      <div className="agencyEdit__innerWrapper">{agencyEditComponent}</div>
    </React.Fragment>
  );
}

export default AgencieEdit;

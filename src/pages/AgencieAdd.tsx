import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { ReactComponent as ChevronLeft } from "../resources/img/svg/chevron-left.svg";
import AgencieAddAllgemeines from "../components/Agency/AgencyAddAllgemeines";
import routePathNames from "../appConfig";

function AgencieEdit() {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <div className="agencyEdit__header">
        <div className="agencyEdit__headerBack">
          <NavLink to="/admin/agency/">
            <ChevronLeft />
            <h3 className="agencyEdit__header--headline">
              {t("agency.add.allgemeines.headline")}
            </h3>
          </NavLink>
        </div>
        <div className="agencyEdit__nav">
          <div className="agencyEdit__navItem">
            <NavLink
              to={routePathNames.agencyAddAllgemeines}
              className="active"
            >
              {t("agency.add.allgemeines.navigation")}
            </NavLink>
          </div>
        </div>
      </div>
      <div className="agencyEdit__innerWrapper">
        <AgencieAddAllgemeines />
      </div>
    </React.Fragment>
  );
}

export default AgencieEdit;

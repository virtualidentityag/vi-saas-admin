import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { ReactComponent as ChevronLeft } from "../resources/img/svg/chevron-left.svg";
import AgencieAddGeneral from "../components/Agency/AgencyAddGeneral";
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
              {t("agency.add.general.headline")}
            </h3>
          </NavLink>
        </div>
        <div className="agencyEdit__nav">
          <div className="agencyEdit__navItem">
            <NavLink to={routePathNames.agencyAddGeneral} className="active">
              {t("agency.add.general.navigation")}
            </NavLink>
          </div>
        </div>
      </div>
      <div className="agencyEdit__innerWrapper">
        <AgencieAddGeneral />
      </div>
    </React.Fragment>
  );
}

export default AgencieEdit;

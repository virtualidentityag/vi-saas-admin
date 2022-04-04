import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import TenantsList from "../components/TenantList/TenantsList";
import routePathNames from "../appConfig";

function Tenants() {
  const { isSuperAdmin } = useSelector((state: any) => state.tenantData);

  return !isSuperAdmin ? (
    <Navigate to={routePathNames.themeSettings} />
  ) : (
    <div>
      <TenantsList />
    </div>
  );
}

export default Tenants;

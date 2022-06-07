import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import routePathNames from "../appConfig";
import TopicList from "../components/Topic/TopicList";

function Topics() {
  const { tenantData } = useSelector((state: any) => state);

  return tenantData.userRoles &&
    tenantData.userRoles.some((role: string) => role === "topic-admin") ? (
    <div>
      <TopicList />
    </div>
  ) : (
    <Navigate to={routePathNames.themeSettings} />
  );
}

export default Topics;

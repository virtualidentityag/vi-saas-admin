import React from "react";
import { Navigate } from "react-router-dom";
import routePathNames from "../appConfig";
import TopicList from "../components/Topic/TopicList";
import hasUserRole from "../utils/hasUserRole";

function Topics() {
  return hasUserRole("topic-admin") ? (
    <div>
      <TopicList />
    </div>
  ) : (
    <Navigate to={routePathNames.themeSettings} />
  );
}

export default Topics;

import { Navigate } from "react-router-dom";
import routePathNames from "../appConfig";
import TopicList from "../components/Topic/TopicList";
import { UserRole } from "../enums/UserRole";
import { useUserRoles } from "../hooks/useUserRoles.hook";

function Topics() {
  const [, hasRole] = useUserRoles();

  return hasRole(UserRole.TopicAdmin) ? (
    <div>
      <TopicList />
    </div>
  ) : (
    <Navigate to={routePathNames.themeSettings} />
  );
}

export default Topics;

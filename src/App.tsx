import React, { useEffect, useState } from "react";
import "./styles/App.less";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import ProtectedPageLayoutWrapper from "./components/Layout/ProtectedPageLayoutWrapper";
import routePathNames from "./appConfig";
// import Dashboard from "./pages/Dashboard";
import TenantSettings from "./pages/TenantSettings";
import Counselors from "./pages/Counselors";
import UserProfile from "./pages/UserProfile";
import Tenants from "./pages/Tenants";
import pubsub, { PubSubEvents } from "./state/pubsub/PubSub";
import Initialisation from "./components/Layout/Initialisation";
import Agencies from "./pages/Agencies";

function App() {
  const [renderAppComponent, setRenderAppComponent] = useState(false);
  pubsub.subscribe(PubSubEvents.USER_AUTHORISED, setRenderAppComponent);

  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (
      location.pathname === routePathNames.root ||
      location.pathname === `${routePathNames.root}/`
    ) {
      navigate("/admin/theme-settings");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return renderAppComponent ? (
    <ProtectedPageLayoutWrapper>
      <Routes>
        {/* later <Route path="/" element={<Dashboard />} /> */}
        <Route
          path={routePathNames.themeSettings}
          element={<TenantSettings />}
        />
        <Route path={routePathNames.counselors} element={<Counselors />} />
        <Route path={routePathNames.agency} element={<Agencies />} />
        <Route path={routePathNames.userProfile} element={<UserProfile />} />
        <Route path={routePathNames.tenants} element={<Tenants />} />
      </Routes>
    </ProtectedPageLayoutWrapper>
  ) : (
    <Initialisation />
  );
}

export default App;

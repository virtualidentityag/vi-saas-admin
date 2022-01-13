import React from "react";
import "./styles/App.less";
import { Route, Routes } from "react-router";
import ProtectedPageLayoutWrapper from "./components/Layout/ProtectedPageLayoutWrapper";
import { routePathNames } from "./appConfig";
import Dashboard from "./pages/Dashboard";
import TenantSettings from "./pages/TenantSettings";
import Counselors from "./pages/Counselors";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <ProtectedPageLayoutWrapper>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path={routePathNames.themeSettings}
          element={<TenantSettings />}
        />
        <Route path={routePathNames.counselors} element={<Counselors />} />
        <Route path={routePathNames.userProfile} element={<UserProfile />} />
      </Routes>
    </ProtectedPageLayoutWrapper>
  );
}

export default App;

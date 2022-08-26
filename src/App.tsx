import { useEffect } from "react";
import "./styles/App.less";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import ProtectedPageLayoutWrapper from "./components/Layout/ProtectedPageLayoutWrapper";
import routePathNames from "./appConfig";
// import Dashboard from "./pages/Dashboard";
import TenantSettings from "./pages/TenantSettings";
import Counselors from "./pages/Counselors";
import Topics from "./pages/Topics";
import Statistic from "./pages/Statistic";
import UserProfile from "./pages/UserProfile";
import Tenants from "./pages/Tenants";
import Initialisation from "./components/Layout/Initialisation";
import Agencies from "./pages/Agencies";
import { useTenantData } from "./hooks/useTenantData.hook";
import { FeatureProvider } from "./context/FeatureContext";
import AgencieEdit from "./pages/AgencieEdit";
import AgencieAdd from "./pages/AgencieAdd";

function App() {
  const { isLoading, data } = useTenantData();
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

  return isLoading ? (
    <Initialisation />
  ) : (
    <FeatureProvider tenantData={data}>
      <ProtectedPageLayoutWrapper>
        <Routes>
          {/* later <Route path="/" element={<Dashboard />} /> */}
          <Route
            path={routePathNames.themeSettings}
            element={<TenantSettings />}
          />
          <Route path={routePathNames.counselors} element={<Counselors />} />
          <Route path={routePathNames.agency} element={<Agencies />} />
          <Route path={routePathNames.agencyEdit} element={<AgencieEdit />} />
          <Route path={routePathNames.agencyAdd} element={<AgencieAdd />} />
          <Route path={routePathNames.topics} element={<Topics />} />
          <Route path={routePathNames.statistic} element={<Statistic />} />
          <Route path={routePathNames.userProfile} element={<UserProfile />} />
          <Route path={routePathNames.tenants} element={<Tenants />} />
        </Routes>
      </ProtectedPageLayoutWrapper>
    </FeatureProvider>
  );
}

export default App;

import "react-app-polyfill/stable";
import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ConfigProvider, message } from "antd";
import { Locale } from "antd/lib/locale-provider";
import de_DE from "antd/es/locale/de_DE";
import en_GB from "antd/es/locale/en_GB";
import App from "./App";
import routePathNames from "./appConfig";
import { store, persistor } from "./store/store";
import Login from "./pages/Login";
import Error404 from "./pages/Error404";
import ProtectedRoute from "./router/ProtectedRoute";
import "./i18n";

interface LangMap {
  [key: string]: Locale;
}

const myLanguages: LangMap = {
  "de-DE": de_DE,
  "en-GB": en_GB,
};

const appConfig = {
  locales: "de-DE",
};

const languageToUse = (appConfig && appConfig.locales) || "de-DE";

/**
 * ant design message config
 * @see {@link https://ant.design/components/message/#API}
 */
message.config({
  duration: 3,
  maxCount: 3,
  top: 100,
});

render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConfigProvider locale={myLanguages[languageToUse]}>
        <Router>
          <Routes>
            <Route path={routePathNames.login} element={<Login />} />
            <Route path="/404" element={<Error404 />} />
            {/* put protected routes at the end to act as a wildcard route fetcher */}
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <App />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </ConfigProvider>
    </PersistGate>
  </Provider>, // Contextprovider does not work at the moment as they have an error there
  document.getElementById("root")
);

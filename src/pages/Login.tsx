import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { Col, Row } from "antd";
import { useTranslation } from "react-i18next";
import Stage from "../components/Login/Stage";
import PublicPageLayoutWrapper from "../components/Layout/PublicPageLayoutWrapper";
import LoginForm from "../components/Login/LoginForm";
import routePathNames from "../appConfig";
import { getValueFromCookie } from "../api/auth/accessSessionCookie";
import { getTokenExpiryFromLocalStorage } from "../api/auth/accessSessionLocalStorage";

/**
 * login component
 * checks if the users token is still valid
 * @constructor
 */
function Login() {
  const accessToken = getValueFromCookie("keycloak");
  const currentTime = new Date().getTime();
  const tokenExpiry = getTokenExpiryFromLocalStorage();
  const accessTokenValidInMs =
    tokenExpiry.accessTokenValidUntilTime - currentTime;

  const refreshTokenValidInMs =
    tokenExpiry.refreshTokenValidUntilTime - currentTime;
  const { id: tenantId } = useSelector((state: any) => state.tenantData);
  const [redirectUrl, setRedirectUrl] = useState("");
  const { t } = useTranslation();
  /**
   * redirect user if authed
   */
  useEffect(() => {
    if (
      accessToken &&
      refreshTokenValidInMs > 0 &&
      accessTokenValidInMs > 0 &&
      tenantId
    ) {
      setRedirectUrl(routePathNames.themeSettings);
    }
  }, [accessToken, accessTokenValidInMs, refreshTokenValidInMs, tenantId, t]);

  return redirectUrl ? (
    <Navigate to={redirectUrl} />
  ) : (
    <PublicPageLayoutWrapper className="login flex-col flex">
      <Stage />
      <Row align="middle" style={{ flex: "1 0 auto" }}>
        <Col
          xs={{ span: 10, offset: 1 }}
          md={{ span: 6, offset: 3 }}
          xl={{ span: 4, offset: 6 }}
        >
          <LoginForm />
        </Col>
      </Row>
    </PublicPageLayoutWrapper>
  );
}

export default Login;

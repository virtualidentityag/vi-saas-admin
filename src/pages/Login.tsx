import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { Col, Row } from "antd";
import isTokenExpired from "../utils/tokenExpires";
import Stage from "../components/Login/Stage";
import PublicPageLayoutWrapper from "../components/Layout/PublicPageLayoutWrapper";
import LoginForm from "../components/Login/LoginForm";

/**
 * login component
 * checks if the users token is still valid
 * @constructor
 */
function Login() {
  const { accessToken, expiresInMilliseconds } = useSelector(
    (state: any) => state.auth
  );
  const { id: userId } = useSelector((state: any) => state.userData);
  const [redirectUrl, setRedirectUrl] = useState("");

  /**
   * redirect user if authed
   */
  useEffect(() => {
    if (accessToken && !isTokenExpired(expiresInMilliseconds) && userId) {
      setRedirectUrl("/");
    }
  }, [accessToken, expiresInMilliseconds, userId]);

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
      ,
    </PublicPageLayoutWrapper>
  );
}

export default Login;

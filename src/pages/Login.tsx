import React from "react";

import { Col, Row } from "antd";

import Stage from "../components/Login/Stage";
import PublicPageLayoutWrapper from "../components/Layout/PublicPageLayoutWrapper";
import LoginForm from "../components/Login/LoginForm";

/**
 * login component
 * checks if the users token is still valid
 * @constructor
 */
function Login() {
  return (
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

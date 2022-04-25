import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useTranslation } from "react-i18next";
import Title from "antd/es/typography/Title";
import getAccessToken from "../../api/auth/getAccessToken";

import getTenantData from "../../api/tenant/getTenantData";
import CustomLockIcon from "../CustomIcons/Lock";
import CustomPersonIcon from "../CustomIcons/Person";
import routePathNames from "../../appConfig";
import { setTokens } from "../../api/auth/auth";
import setIsSuperAdmin from "../../utils/setIsSuperAdmin";
import CustomVerifiedIcon from "../CustomIcons/Verified";
import { FETCH_ERRORS } from "../../api/fetchData";

function LoginForm() {
  const { t } = useTranslation();
  const [postLoading, setPostLoading] = useState(false);
  const [otpDisabled, setOtpDisabled] = useState(true);

  // Function gets fired on Form Submit
  const onFinish = async (values: any) => {
    setPostLoading(true);

    return getAccessToken({
      username: values.username,
      password: values.password,
      otp: values.otp,
    })
      .then((response) => {
        // store the access token data
        setTokens(
          response.access_token,
          response.expires_in,
          response.refresh_token,
          response.refresh_expires_in
        );

        return response;
      })
      .then((response) => {
        return setIsSuperAdmin(response.access_token);
      })
      .then((isSuperAdmin) => {
        if (!isSuperAdmin) {
          getTenantData();
        }
        return isSuperAdmin;
      })
      .catch((data) => {
        if (data === FETCH_ERRORS.BAD_REQUEST) {
          setOtpDisabled(false);
        } else {
          message.error(t("message.error.auth.login"));
        }
      })
      .finally(() => {
        setPostLoading(false);
      });
  };

  return (
    <div className="loginForm">
      <Form
        name="basic"
        labelCol={{ xs: { span: 2 } }}
        wrapperCol={{ xs: { span: 8 } }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        title={t("admin.login")}
        size="large"
      >
        <Form.Item
          wrapperCol={{
            xs: { offset: 0, span: 12 },
            md: { offset: 2, span: 8 },
          }}
        >
          <Title level={2}>{t("admin.login")}</Title>
        </Form.Item>
        <Form.Item
          label={
            <>
              <CustomPersonIcon />
              <span className="labelText">{t("username")}</span>
            </>
          }
          name="username"
          rules={[
            {
              required: true,
              message: t("message.form.login.username"),
            },
          ]}
        >
          <Input placeholder={t("username.or.email")} />
        </Form.Item>

        <Form.Item
          label={
            <>
              <CustomLockIcon />
              <span className="labelText">{t("password")}</span>
            </>
          }
          name="password"
          rules={[
            { required: true, message: t("message.form.login.password") },
          ]}
        >
          <Input.Password placeholder={t("password")} />
        </Form.Item>

        <Form.Item
          label={
            <>
              <CustomVerifiedIcon />
              <span className="labelText">{t("otp")}</span>
            </>
          }
          name="otp"
          rules={[
            { required: !otpDisabled, message: t("message.form.login.otp") },
          ]}
          hidden={otpDisabled}
          extra={t("message.form.login.otp.extra")}
        >
          <Input placeholder={t("otp")} />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            xs: { offset: 0, span: 12 },
            md: { offset: 2, span: 8 },
          }}
        >
          {/*
           * ATTENTION: this link will not work on local const maschines.
           * to make them work on LIVE/DEV they link to a route "outside / above" the scope of of this admin console,
           * but on the same host.
           * we have 2 seperated repos / applications
           * example:
           * https://tenant1.onlineberatung.net/impressum is the Imprint page
           * https://tenant1.onlineberatung.net/admin/settings ist the admin console settings page
           *
           */}
          <a
            href={routePathNames.loginResetPasswordLink}
            type="link"
            className="forgotPW"
          >
            {t("password.forgot")}
          </a>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            xs: { offset: 0, span: 12 },
            md: { offset: 2, span: 8 },
          }}
          shouldUpdate
        >
          {({ getFieldsValue }) => {
            const { username, password } = getFieldsValue();
            const formIsComplete = !!username && !!password;
            return (
              <Button
                block
                type="primary"
                htmlType="submit"
                loading={postLoading}
                disabled={!formIsComplete}
              >
                {t("message.form.login.loginBtn")}
              </Button>
            );
          }}
        </Form.Item>
      </Form>
    </div>
  );
}

export default LoginForm;

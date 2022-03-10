import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Title from "antd/es/typography/Title";
import { Navigate } from "react-router-dom";
import getAccessToken from "../../api/auth/getAccessToken";

import requestCatchHandler from "../../api/requestCatchHandler";
import getTenantData from "../../api/tenant/getTenantData";
import CustomLockIcon from "../CustomIcons/Lock";
import CustomPersonIcon from "../CustomIcons/Person";
import routePathNames from "../../appConfig";

function LoginForm() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [postLoading, setPostLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");
  // Function gets fired on Form Submit
  const onFinish = async (values: any) => {
    setPostLoading(true);

    return getAccessToken(values.username, values.password)
      .then((response) => {
        // store the access token data
        dispatch({
          type: "auth/set-token",
          payload: response,
        });
        return response;
      })
      .then(() => getTenantData())
      .then(() => {
        /**
         * redirect user if authed
         */
        message.success(t("message.success.auth.login"));
        setRedirectUrl(routePathNames.themeSettings);
      })
      .catch((error) => {
        setPostLoading(false);
        if (error) {
          message.error(t("message.error.auth.login"));
        }
        requestCatchHandler(error);
      });
  };

  /* const changeLanguage = (lang: Languages) => {
                                                                                    changeLang(lang);
                                                                                  }; */

  return redirectUrl ? (
    <Navigate to={redirectUrl} />
  ) : (
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
          <Input placeholder={t("username")} />
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
      {/*
      <Button type="link" onClick={() => changeLanguage("en")}>
        EN
      </Button>
      <Button type="link" onClick={() => changeLanguage("de")}>
        DE
      </Button>
      */}
    </div>
  );
}

export default LoginForm;

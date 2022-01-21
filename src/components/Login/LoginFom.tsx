import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import axios from "axios";
import getCancelTokenSource from "../../api/getCancelTokenSource";
import getFAKEAccessToken from "../../api/auth/getFAKEAccessToken";
import getFAKEUserData from "../../api/user/getFAKEUserData";
import requestCatchHandler from "../../api/requestCatchHandler";
import { messageData } from "../../appConfig";
import getFAKETenantData from "../../api/tenant/getFAKETenantData";

function LoginForm() {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const [postLoading, setPostLoading] = useState(false);

  // cancelToken for consistency, but you do not want to cancel those calls
  const cancelTokenSource = getCancelTokenSource();

  // Function gets fired on Form Submit
  const onFinish = async (values: any) => {
    setPostLoading(true);

    return getFAKEAccessToken(values.username, values.password)
      .then((response) => {
        // store the access token data
        dispatch({
          type: "auth/set-token",
          payload: response,
        });
      })
      .then(() => getFAKEUserData(cancelTokenSource))
      .then((response) => {
        // store the access token data
        dispatch({
          type: "user/set-data",
          payload: response,
        });
        return response.tenantId;
      })
      .then(() => getFAKETenantData(cancelTokenSource))
      .then((response) => {
        // store the access token data
        dispatch({
          type: "tenant/set-data",
          payload: response,
        });
      })
      .then(() => {
        message.success(messageData.success.auth.login);
      })
      .catch((error) => {
        setPostLoading(false);
        if (!axios.isCancel(error)) {
          message.error(messageData.error.auth.login);
        }

        requestCatchHandler(error);
      });
  };

  /* const changeLanguage = (lang: Languages) => {
      changeLang(lang);
    }; */

  return (
    <div>
      <Form
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 8 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label={t("Username")}
          name="username"
          rules={[
            {
              required: true,
              type: "email",
              message: t("message.form.login.username"),
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t("Password")}
          name="password"
          rules={[
            { required: true, message: t("message.form.login.password") },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={postLoading}>
            {t("Anmelden")}
          </Button>
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

import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import axios from "axios";
import Title from "antd/es/typography/Title";
import getCancelTokenSource from "../../api/getCancelTokenSource";
import getFAKEAccessToken from "../../api/auth/getFAKEAccessToken";
import getFAKEUserData from "../../api/user/getFAKEUserData";
import requestCatchHandler from "../../api/requestCatchHandler";
import getFAKETenantData from "../../api/tenant/getFAKETenantData";
import CustomLockIcon from "../CustomIcons/Lock";
import CustomPersonIcon from "../CustomIcons/Person";

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
      .then((response) => getFAKETenantData(response, cancelTokenSource))
      .then((response) => {
        // store the access token data
        dispatch({
          type: "tenant/set-data",
          payload: response,
        });
      })
      .then(() => {
        message.success(t("message.success.auth.login"));
      })
      .catch((error) => {
        setPostLoading(false);
        if (!axios.isCancel(error)) {
          message.error(t("message.error.auth.login"));
        }

        requestCatchHandler(error);
      });
  };

  /* const changeLanguage = (lang: Languages) => {
                                                                                    changeLang(lang);
                                                                                  }; */

  return (
    <div className="loginForm">
      <Form
        name="basic"
        labelCol={{ xs: { span: 2 } }}
        wrapperCol={{ xs: { span: 8 } }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        title="Admin Login"
        size="large"
      >
        <Form.Item
          wrapperCol={{
            xs: { offset: 0, span: 12 },
            md: { offset: 2, span: 8 },
          }}
        >
          <Title level={2}>Admin Login</Title>
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
              type: "email",
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
          <Button type="link" className="forgotPW">
            {t("password.forgot")}
          </Button>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            xs: { offset: 0, span: 12 },
            md: { offset: 2, span: 8 },
          }}
        >
          <Button block type="primary" htmlType="submit" loading={postLoading}>
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

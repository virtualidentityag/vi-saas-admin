import React, { useEffect } from "react";
import { Layout } from "antd";
import clsx from "clsx";
import SiteFooter from "./SiteFooter";
import getPublicTenantData from "../../api/tenant/getPublicTenantData";
import { useAppConfigContext } from "../../context/useAppConfig";

const { Content } = Layout;

export interface PublicPageLayoutWrapperTypes {
  className?: string;
  children: React.ReactNode;
}

function PublicPageLayoutWrapper({
  children,
  className = "",
}: PublicPageLayoutWrapperTypes) {
  const { settings } = useAppConfigContext();

  useEffect(() => {
    getPublicTenantData(settings);
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content className={clsx("publicContent", className)}>{children}</Content>
      <SiteFooter />
    </Layout>
  );
}

export default PublicPageLayoutWrapper;

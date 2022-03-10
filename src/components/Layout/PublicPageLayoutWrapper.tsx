import React, { useEffect } from "react";
import { Layout } from "antd";
import clsx from "clsx";
import SiteFooter from "./SiteFooter";
import getPublicTenantData from "../../api/tenant/getPublicTenantData";

const { Content } = Layout;

export interface PublicPageLayoutWrapperTypes {
  className?: string;
  children: React.ReactNode;
}

function PublicPageLayoutWrapper({
  children,
  className = "",
}: PublicPageLayoutWrapperTypes) {
  useEffect(() => {
    getPublicTenantData();
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content className={clsx("publicContent", className)}>{children}</Content>
      <SiteFooter />
    </Layout>
  );
}

export default PublicPageLayoutWrapper;

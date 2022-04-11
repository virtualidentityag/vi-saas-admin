import { Spin } from "antd";
import React, { useEffect } from "react";
import getPublicTenantData from "../../api/tenant/getPublicTenantData";
import getTenantData from "../../api/tenant/getTenantData";

export default function Initialisation() {
  useEffect(() => {
    getPublicTenantData().then(() => getTenantData());
  }, []);

  return (
    <div style={{ position: "absolute", left: "50%", top: "50%" }}>
      <Spin size="large" />
    </div>
  );
}

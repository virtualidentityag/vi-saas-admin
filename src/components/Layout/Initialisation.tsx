import React from "react";
import { Spin } from "antd";

export default function Initialisation() {
  return (
    <div style={{ position: "absolute", left: "50%", top: "50%" }}>
      <Spin size="large" />
    </div>
  );
}

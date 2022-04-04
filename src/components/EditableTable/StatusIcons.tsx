import React from "react";

import {
  CheckOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Status } from "../../types/status";

function StatusIcons({ status }: { status: Status }) {
  return (
    <div className="statusIconWrapper">
      {status === "IN_PROGRESS" && <InfoCircleOutlined />}
      {status === "ERROR" && <CloseCircleOutlined />}
      {status === "CREATED" && <CheckOutlined />}
    </div>
  );
}

export default StatusIcons;

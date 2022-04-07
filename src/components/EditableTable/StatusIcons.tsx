import React from "react";

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { Status } from "../../types/status";

function StatusIcons({ status }: { status: Status }) {
  const { t } = useTranslation();
  return (
    <div className={clsx("statusIconWrapper", status)}>
      {status === "IN_PROGRESS" && (
        <Tooltip color="blue" title={t("status.IN_PROGRESS.tooltip")}>
          <InfoCircleOutlined />
        </Tooltip>
      )}
      {status === "ERROR" && (
        <Tooltip color="red" title={t("status.ERROR.tooltip")}>
          <CloseCircleOutlined />
        </Tooltip>
      )}
      {status === "CREATED" && (
        <Tooltip color="green" title={t("status.CREATED.tooltip")}>
          <CheckCircleOutlined />
        </Tooltip>
      )}
    </div>
  );
}

export default StatusIcons;

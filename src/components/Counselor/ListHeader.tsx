import { Button, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { UserAddOutlined } from "@ant-design/icons";
import React from "react";

const { Title } = Typography;

function ListHeader({
  count,
  addHandler,
}: {
  count: number;
  addHandler: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="counselorListHeader">
      <Title level={2}>
        {count > 0 && (
          <span>
            {count} {t("counselor.title")}
          </span>
        )}
      </Title>
      <Button onClick={addHandler} icon={<UserAddOutlined />} />
    </div>
  );
}

export default ListHeader;

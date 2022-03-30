import { Button, Popover } from "antd";
import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

function AddButton({
  allowedNumberOfUsers,
  sourceLength,
  handleBtnAdd,
}: AddButtonProps) {
  const { t } = useTranslation();
  const StyledButton = (
    <Button
      className="mb-m mr-sm"
      type="primary"
      icon={<PlusOutlined />}
      onClick={handleBtnAdd}
      disabled={sourceLength >= allowedNumberOfUsers}
    >
      {t("new")}
    </Button>
  );

  return (
    <div>
      {sourceLength >= allowedNumberOfUsers ? (
        <Popover
          placement="bottomRight"
          content={t("counselor.new.help", { number: allowedNumberOfUsers })}
          title={t("notice")}
          trigger="hover"
        >
          {StyledButton}
        </Popover>
      ) : (
        StyledButton
      )}
      <span>
        {sourceLength}/{allowedNumberOfUsers} {t("counselor.title")}
      </span>
    </div>
  );
}

export default AddButton;

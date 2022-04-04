import { Button, Popover } from "antd";
import React, { useCallback } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

function AddButton({
  allowedNumberOfUsers,
  sourceLength,
  handleBtnAdd,
}: AddButtonProps) {
  const { t } = useTranslation();
  const StyledButton = useCallback(
    ({ disabled }) => {
      return (
        <Button
          className="mb-m mr-sm"
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleBtnAdd}
          disabled={disabled}
        >
          {t("new")}
        </Button>
      );
    },
    [handleBtnAdd, t]
  );

  return (
    <div>
      {sourceLength >= allowedNumberOfUsers &&
      allowedNumberOfUsers !== false ? (
        <Popover
          placement="bottomRight"
          content={t("counselor.new.help", { number: allowedNumberOfUsers })}
          title={t("notice")}
          trigger="hover"
        >
          {StyledButton({ disabled: true })}
        </Popover>
      ) : (
        StyledButton({ disabled: false })
      )}
      {allowedNumberOfUsers !== false && (
        <span>
          {sourceLength}/{allowedNumberOfUsers} {t("counselor.title")}
        </span>
      )}
    </div>
  );
}

export default AddButton;

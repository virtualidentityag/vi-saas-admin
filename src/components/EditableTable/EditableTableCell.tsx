import React from "react";
import { Input, InputNumber, Form } from "antd";
import { useTranslation } from "react-i18next";
import { EditableTableCellProps } from "../../types/editabletable";

function EditableTableCell({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}: EditableTableCellProps) {
  const { t } = useTranslation();
  const inputNode =
    inputType === "number" ? (
      <InputNumber size="small" />
    ) : (
      <Input size="small" />
    );

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: t("message.form.edit.mandatory"),
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
}

export default EditableTableCell;
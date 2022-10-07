import { Form, Input } from "antd";
import { useTranslation } from "react-i18next";

interface FormTextAreaFieldProps {
  labelKey: string;
  placeholderKey?: string;
  required?: boolean;
  name: string;
}

export function FormTextAreaField({
  name,
  labelKey,
  required,
  placeholderKey,
}: FormTextAreaFieldProps) {
  const { t } = useTranslation();

  return (
    <Form.Item label={t(labelKey)} name={name} rules={[{ required }]}>
      <Input.TextArea
        placeholder={placeholderKey && t(placeholderKey)}
        rows={3}
      />
    </Form.Item>
  );
}

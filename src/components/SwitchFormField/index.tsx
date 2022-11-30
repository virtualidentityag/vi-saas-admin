import { useTranslation } from 'react-i18next';
import { Form, Switch } from 'antd';

export interface SwitchFormFieldProps {
    label: string;
    name: string | string[];
    help?: string;
    required?: boolean;
    errorMessage?: string;
}

export const SwitchFormField = ({ label, name, help, errorMessage, required }: SwitchFormFieldProps) => {
    const [t] = useTranslation();
    const message = errorMessage || t('form.errors.required');

    return (
        <Form.Item
            name={name}
            label={t(label)}
            rules={required ? [{ required: true, message }] : undefined}
            help={help ? t(help) : undefined}
            valuePropName="checked"
        >
            <Switch size="default" checkedChildren={t('yes')} unCheckedChildren={t('no')} />
        </Form.Item>
    );
};

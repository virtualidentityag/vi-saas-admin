import { Form, Input, InputProps } from 'antd';
import { Rule } from 'antd/lib/form';
import { useTranslation } from 'react-i18next';

interface FormInputFieldProps extends InputProps {
    labelKey: string;
    placeholderKey?: string;
    required?: boolean;
    name: string;
    rules?: Rule[];
}

export const FormInputField = ({
    name,
    labelKey,
    required,
    placeholderKey,
    rules,
    ...inputProps
}: FormInputFieldProps) => {
    const { t } = useTranslation();

    return (
        <Form.Item label={t(labelKey)} name={name} rules={[{ required }, ...(rules || [])]}>
            <Input {...inputProps} placeholder={placeholderKey && t(placeholderKey)} />
        </Form.Item>
    );
};

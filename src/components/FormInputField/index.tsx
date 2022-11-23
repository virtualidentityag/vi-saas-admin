import { Form, Input, InputProps } from 'antd';
import { useTranslation } from 'react-i18next';

interface FormInputFieldProps extends InputProps {
    labelKey: string;
    placeholderKey?: string;
    required?: boolean;
    name: string;
}

export const FormInputField = ({ name, labelKey, required, placeholderKey, ...inputProps }: FormInputFieldProps) => {
    const { t } = useTranslation();

    return (
        <Form.Item label={t(labelKey)} name={name} rules={[{ required }]}>
            <Input
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...inputProps}
                placeholder={placeholderKey && t(placeholderKey)}
            />
        </Form.Item>
    );
};

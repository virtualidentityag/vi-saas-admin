import { Form, Input, InputProps } from 'antd';
import { Rule } from 'antd/lib/form';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.scss';

interface FormInputFieldProps extends InputProps {
    labelKey: string;
    placeholderKey?: string;
    required?: boolean;
    /**
     * Only optional when used with TranslatableFormField
     */
    name?: string;
    rules?: Rule[];
}

export const FormInputField = ({
    className,
    name,
    labelKey,
    required,
    placeholderKey,
    rules,
    ...inputProps
}: FormInputFieldProps) => {
    const { t } = useTranslation();

    return (
        <Form.Item className={className} label={t(labelKey)} name={name} rules={[{ required }, ...(rules || [])]}>
            <Input {...inputProps} className={styles.input} placeholder={placeholderKey && t(placeholderKey)} />
        </Form.Item>
    );
};

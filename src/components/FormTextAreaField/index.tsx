import { Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.scss';

interface FormTextAreaFieldProps {
    labelKey: string;
    placeholderKey?: string;
    required?: boolean;
    name: string;
}

export const FormTextAreaField = ({ name, labelKey, required, placeholderKey }: FormTextAreaFieldProps) => {
    const { t } = useTranslation();

    return (
        <Form.Item label={t(labelKey)} name={name} rules={[{ required }]}>
            <Input.TextArea className={styles.textarea} placeholder={placeholderKey && t(placeholderKey)} rows={3} />
        </Form.Item>
    );
};

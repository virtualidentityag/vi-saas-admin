import { Form, Input, InputProps } from 'antd';
import { Rule } from 'antd/lib/form';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.scss';

interface FormInputFieldProps extends Omit<InputProps, 'name'> {
    labelKey: string;
    placeholderKey?: string;
    required?: boolean;
    /**
     * Only optional when used with TranslatableFormField
     */
    name?: string | string[];
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
        <Form.Item
            className={classNames(className, styles.item)}
            label={t(labelKey)}
            name={name}
            rules={[{ required }, ...(rules || [])]}
        >
            <Input {...inputProps} className={styles.input} placeholder={placeholderKey && t(placeholderKey)} />
        </Form.Item>
    );
};

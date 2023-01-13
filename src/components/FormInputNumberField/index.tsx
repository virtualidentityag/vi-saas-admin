import { Form, InputNumber, InputNumberProps } from 'antd';
import DisabledContext from 'antd/es/config-provider/DisabledContext';
import { Rule } from 'antd/lib/form';
import classNames from 'classnames';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.scss';

interface FormInputFieldProps extends Omit<InputNumberProps, 'name'> {
    labelKey?: string;
    placeholderKey?: string;
    required?: boolean;
    /**
     * Only optional when used with TranslatableFormField
     */
    name?: string | string[];
    rules?: Rule[];
}

export const FormInputNumberField = ({
    className,
    name,
    labelKey,
    required,
    placeholderKey,
    rules,
    ...inputProps
}: FormInputFieldProps) => {
    const contextDisabled = useContext(DisabledContext);
    const { t } = useTranslation();

    return (
        <Form.Item
            className={classNames(className, styles.item, { [styles.disabled]: contextDisabled })}
            label={t(labelKey)}
            name={name}
            rules={[{ required }, ...(rules || [])]}
        >
            <InputNumber {...inputProps} className={styles.input} placeholder={placeholderKey && t(placeholderKey)} />
        </Form.Item>
    );
};

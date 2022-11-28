import { useTranslation } from 'react-i18next';
import { Form, Select } from 'antd';

export interface Option {
    label: string;
    value: string;
}

export interface SelectFormFieldProps {
    label: string;
    name: string | string[];
    placeholder?: string;
    help?: string;
    loading?: boolean;
    required?: boolean;
    isMulti?: boolean;
    options: Option[];
    allowClear?: boolean;
    disabled?: boolean;
    errorMessage?: string;
    labelInValue?: boolean;
}

export const SelectFormField = ({
    label,
    options,
    name,
    isMulti,
    help,
    allowClear,
    required,
    loading,
    placeholder,
    disabled,
    errorMessage,
    labelInValue,
}: SelectFormFieldProps) => {
    const [t] = useTranslation();
    const message = errorMessage || t('form.errors.required');

    return (
        <Form.Item
            name={name}
            label={t(label)}
            rules={required ? [{ required: true, message }] : undefined}
            help={help ? t(help) : undefined}
        >
            <Select
                disabled={disabled}
                showSearch
                labelInValue={labelInValue}
                loading={loading}
                allowClear={allowClear}
                getPopupContainer={(element: HTMLElement) => element.parentElement}
                mode={isMulti ? 'multiple' : undefined}
                placeholder={placeholder ? t(placeholder) : undefined}
                optionFilterProp="children"
                filterOption={(input, option) => option.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                filterSort={(optionA, optionB) =>
                    optionA.label?.toLowerCase().localeCompare(optionB.label?.toLowerCase())
                }
                options={options}
            />
        </Form.Item>
    );
};

import { Form } from 'antd';
import { useContext } from 'react';
import DisabledContext from 'antd/es/config-provider/DisabledContext';
import classNames from 'classnames';
import ColorSelector from '../ColorSelector/ColorSelector';
import styles from './styles.module.scss';

interface FormColorSelectorFieldProps {
    className?: string;
    name?: string | string[];
    required?: boolean;
}

interface FormColorSelectorProps {
    onChange?: (value: string) => void;
    value?: string;
}

const FormColorSelectorLocal = ({ onChange, value }: FormColorSelectorProps) => {
    const contextDisabled = useContext(DisabledContext);

    return (
        <ColorSelector
            isLoading={contextDisabled}
            tenantColor={value}
            setColorValue={(_, color: string) => onChange(color)}
            field="primaryColor"
        />
    );
};

export const FormColorSelectorField = ({ className, name, required }: FormColorSelectorFieldProps) => {
    return (
        <Form.Item className={classNames(className, styles.item)} name={name} rules={[{ required }]}>
            <FormColorSelectorLocal />
        </Form.Item>
    );
};

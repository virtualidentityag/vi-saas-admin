import { Form, Switch } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import { useTranslation } from 'react-i18next';

interface FormSwitchFieldProps {
    labelKey: string;
    required?: boolean;
    disabled?: boolean;
    paragraphKey?: string;
    name: string;
}

interface FormSwitchFieldLocalProps {
    onChange?: (value: boolean) => void;
    value?: boolean;
    disabled?: boolean;
    paragraphKey: string;
}

const FormSwitchFieldLocal = ({ onChange, value, paragraphKey, disabled }: FormSwitchFieldLocalProps) => {
    const { t } = useTranslation();

    return (
        <div className="formSwitchField__container">
            <Switch size="default" disabled={disabled} onChange={onChange} checked={value} />
            {paragraphKey && <Paragraph className="desc__toggleText">{t(paragraphKey)}</Paragraph>}
        </div>
    );
};
export const FormSwitchField = ({ name, labelKey, required, disabled, paragraphKey }: FormSwitchFieldProps) => {
    const { t } = useTranslation();

    return (
        <Form.Item label={t(labelKey)} name={name} rules={[{ required }]}>
            <FormSwitchFieldLocal disabled={disabled} paragraphKey={paragraphKey} />
        </Form.Item>
    );
};

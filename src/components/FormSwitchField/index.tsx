import { Form, Switch } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.scss';

interface FormSwitchFieldProps {
    labelKey: string;
    name: string | string[];
    help?: string;
    disabled?: boolean;
    required?: boolean;
    errorMessage?: string;
    checkedKey?: string;
    unCheckedKey?: string;
    paragraphKey?: string;
}

interface FormSwitchFieldLocalProps {
    onChange?: (value: boolean) => void;
    checked?: boolean;
    disabled?: boolean;
    paragraphKey?: string;
    checkedKey: string;
    unCheckedKey: string;
}

const FormSwitchFieldLocal = ({
    onChange,
    checked,
    paragraphKey,
    checkedKey,
    disabled,
    unCheckedKey,
}: FormSwitchFieldLocalProps) => {
    const { t } = useTranslation();

    return (
        <div className="formSwitchField__container">
            <Switch
                disabled={disabled}
                size="default"
                onChange={onChange}
                checked={checked}
                checkedChildren={t(checkedKey)}
                unCheckedChildren={t(unCheckedKey)}
            />
            {paragraphKey && <Paragraph className="desc__toggleText">{t(paragraphKey)}</Paragraph>}
        </div>
    );
};

export const FormSwitchField = ({
    name,
    labelKey,
    required,
    help,
    disabled,
    errorMessage,
    paragraphKey,
    checkedKey = 'yes',
    unCheckedKey = 'no',
}: FormSwitchFieldProps) => {
    const [t] = useTranslation();
    const message = errorMessage || t('form.errors.required');

    return (
        <Form.Item
            name={name}
            label={t(labelKey)}
            rules={required ? [{ required: true, message }] : undefined}
            help={help ? t(help) : undefined}
            valuePropName="checked"
            className={classNames(styles.item)}
        >
            <FormSwitchFieldLocal
                paragraphKey={paragraphKey}
                checkedKey={checkedKey}
                unCheckedKey={unCheckedKey}
                disabled={disabled}
            />
        </Form.Item>
    );
};

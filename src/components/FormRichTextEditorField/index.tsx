import { Form } from 'antd';
import DisabledContext from 'antd/es/config-provider/DisabledContext';
import classNames from 'classnames';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import RichTextEditor from '../RichText/RichTextEditor';
import styles from './styles.module.scss';

interface FormRichTextEditorFieldProps {
    className?: string;
    labelKey?: string;
    required?: boolean;
    placeholderKey?: string;
    name?: string | string[];
}

interface FormRichTextEditorProps {
    onChange?: (value: boolean) => void;
    value?: boolean;
    placeholderKey: string;
}

const FormRichTextEditor = ({ onChange, value, placeholderKey }: FormRichTextEditorProps) => {
    const { t } = useTranslation();
    const contextDisabled = useContext(DisabledContext);

    return (
        <RichTextEditor
            className={classNames({ [styles.disabled]: contextDisabled })}
            onChange={(text) => onChange(text.toString('html'))}
            value={value || ''}
            disabled={contextDisabled}
            placeholder={placeholderKey ? t(placeholderKey) : undefined}
        />
    );
};
export const FormRichTextEditorField = ({
    className,
    name,
    labelKey,
    required,
    placeholderKey,
}: FormRichTextEditorFieldProps) => {
    const { t } = useTranslation();

    return (
        <Form.Item
            className={classNames(className, styles.richEditor)}
            label={t(labelKey)}
            name={name}
            rules={[{ required }]}
        >
            <FormRichTextEditor placeholderKey={placeholderKey} />
        </Form.Item>
    );
};

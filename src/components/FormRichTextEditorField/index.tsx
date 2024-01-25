import { Form } from 'antd';
import DisabledContext from 'antd/es/config-provider/DisabledContext';
import classNames from 'classnames';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import RichTextEditor from '../RichText/RichTextEditor';
import styles from './styles.module.scss';

interface FormRichTextEditorFieldProps {
    className?: string;
    labelKey?: string;
    required?: boolean;
    placeholderKey?: string;
    name?: string | string[];
    placeholders?: { [key: string]: string };
}

interface FormRichTextEditorProps {
    onFocus?: () => void;
    onBlur?: () => void;
    onChange?: (value: string) => void;
    value?: boolean;
    placeholderKey: string;
    className?: string;
    placeholders?: { [key: string]: string };
}

const FormRichTextEditor = ({
    onChange,
    onBlur,
    onFocus,
    value,
    className,
    placeholderKey,
    placeholders,
}: FormRichTextEditorProps) => {
    const { t } = useTranslation();
    const contextDisabled = useContext(DisabledContext);

    return (
        <RichTextEditor
            className={classNames(className)}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            value={value || ''}
            disabled={contextDisabled}
            placeholder={placeholderKey ? t(placeholderKey) : undefined}
            placeholders={placeholders}
        />
    );
};
export const FormRichTextEditorField = ({
    className,
    name,
    labelKey,
    required,
    placeholderKey,
    placeholders,
}: FormRichTextEditorFieldProps) => {
    const { t } = useTranslation();
    const [focused, setFocused] = useState(false);
    const contextDisabled = useContext(DisabledContext);

    return (
        <Form.Item
            className={classNames(className, styles.richEditor, {
                [styles.disabled]: contextDisabled,
                [styles.focused]: focused,
            })}
            label={t(labelKey)}
            name={name}
            rules={[{ required }]}
        >
            <FormRichTextEditor
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholderKey={placeholderKey}
                className={styles.input}
                placeholders={placeholders}
            />
        </Form.Item>
    );
};

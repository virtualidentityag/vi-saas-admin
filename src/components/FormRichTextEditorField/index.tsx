import { Form } from 'antd';
import DisabledContext from 'antd/es/config-provider/DisabledContext';
import classNames from 'classnames';
import { useCallback, useContext, useState } from 'react';
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
    onFocus?: () => void;
    onBlur?: () => void;
    onChange?: (value: boolean) => void;
    value?: boolean;
    placeholderKey: string;
    className?: string;
}

const FormRichTextEditor = ({
    onChange,
    onBlur,
    onFocus,
    value,
    className,
    placeholderKey,
}: FormRichTextEditorProps) => {
    const { t } = useTranslation();
    const contextDisabled = useContext(DisabledContext);

    const onChangeLocal = useCallback((ev) => {
        const html = ev.toString('html');
        // Rich editor when we click even if it's empty it creates the content
        //  '<p><br></p>' so when that happens we still want to validate as empty
        onChange(html === '<p><br></p>' ? '' : html);
    }, []);

    return (
        <RichTextEditor
            className={classNames(className)}
            onChange={onChangeLocal}
            onBlur={onBlur}
            onFocus={onFocus}
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
            />
        </Form.Item>
    );
};

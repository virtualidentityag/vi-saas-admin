import { useState } from 'react';
import RichTextEditor, { EditorValue, ToolbarConfig } from 'react-rte';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

interface OnChangeHandler {
    (e: any): void;
}

type RichTextEditorProps = {
    value: any;
    onChange: OnChangeHandler;
    placeholder: string;
    disabled?: boolean;
    className?: string;
};

const RTE = ({ value, onChange, placeholder, disabled, className }: RichTextEditorProps) => {
    const { t } = useTranslation();
    const [editorState, setEditorState] = useState(() => RichTextEditor.createValueFromString(value, 'html'));

    const handleChange = (edited: EditorValue) => {
        setEditorState(edited);
        onChange(edited);
    };

    const toolbarConfig: ToolbarConfig = {
        // Optionally specify the groups to display (displayed in the order listed).
        display: ['BLOCK_TYPE_DROPDOWN', 'INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'IMAGE_BUTTON'],
        INLINE_STYLE_BUTTONS: [
            { label: 'Bold', style: 'BOLD', className: 'custom-css-class' },
            { label: 'Italic', style: 'ITALIC' },
            { label: 'Underline', style: 'UNDERLINE' },
        ],
        BLOCK_TYPE_DROPDOWN: [
            { label: t('rte.text'), style: 'unstyled' },
            { label: t('rte.h1'), style: 'header-one' },
            { label: t('rte.h2'), style: 'header-two' },
            { label: t('rte.h3'), style: 'header-three' },
            { label: t('rte.h4'), style: 'header-four' },
        ],
        BLOCK_TYPE_BUTTONS: [
            { label: 'UL', style: 'unordered-list-item' },
            { label: 'OL', style: 'ordered-list-item' },
        ],
    };

    return (
        <RichTextEditor
            disabled={disabled}
            value={editorState}
            onChange={handleChange}
            toolbarConfig={toolbarConfig}
            className={classNames('rte', className)}
            placeholder={placeholder}
        />
    );
};

export default RTE;

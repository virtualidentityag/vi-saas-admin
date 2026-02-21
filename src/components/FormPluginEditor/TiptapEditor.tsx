import { useCallback, useContext, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import DisabledContext from 'antd/es/config-provider/DisabledContext';
import classNames from 'classnames';
import styles from './styles.module.scss';
import { Toolbar } from './Toolbar';

interface TiptapEditorProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    placeholders?: Record<string, string>;
    className?: string;
}

const TiptapEditor = ({ value = '', onChange, placeholder, placeholders, className }: TiptapEditorProps) => {
    const disabled = useContext(DisabledContext);
    const suppressChange = useRef(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3, 4, 5, 6] },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { rel: 'noopener noreferrer' },
            }),
            Underline,
            Placeholder.configure({ placeholder }),
        ],
        content: value || '',
        editable: !disabled,
        onUpdate: ({ editor: ed }) => {
            if (suppressChange.current) return;
            const html = ed.isEmpty ? '' : ed.getHTML();
            onChange?.(html);
        },
    });

    useEffect(() => {
        if (!editor) return;
        editor.setEditable(!disabled);
    }, [disabled, editor]);

    // Sync external value changes (e.g. form reset)
    useEffect(() => {
        if (!editor) return;
        const currentHTML = editor.isEmpty ? '' : editor.getHTML();
        if (value !== currentHTML) {
            suppressChange.current = true;
            editor.commands.setContent(value || '');
            suppressChange.current = false;
        }
    }, [value, editor]);

    const insertPlaceholder = useCallback(
        (key: string) => {
            if (!editor) return;
            editor.chain().focus().insertContent(`\${${key}}`).run();
        },
        [editor],
    );

    return (
        <div
            className={classNames(styles.editor, className, {
                [styles.disabled]: disabled,
            })}
        >
            {!disabled && editor && (
                <Toolbar editor={editor} placeholders={placeholders} onInsertPlaceholder={insertPlaceholder} />
            )}
            <EditorContent editor={editor} className={styles.editorContent} />
        </div>
    );
};

export default TiptapEditor;

import { useCallback, useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button, Input, Popover, Space, Tooltip } from 'antd';
import {
    BoldOutlined,
    ItalicOutlined,
    UnderlineOutlined,
    StrikethroughOutlined,
    OrderedListOutlined,
    UnorderedListOutlined,
    LinkOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.scss';

interface ToolbarProps {
    editor: Editor;
    placeholders?: Record<string, string>;
    onInsertPlaceholder: (key: string) => void;
}

const HeadingSelect = ({ editor }: { editor: Editor }) => {
    const { t } = useTranslation();

    const currentLevel = [1, 2, 3, 4, 5, 6].find((level) =>
        editor.isActive('heading', { level }),
    );

    return (
        <select
            className={styles.headingSelect}
            value={currentLevel ? `h${currentLevel}` : 'p'}
            onChange={(e) => {
                const val = e.target.value;
                if (val === 'p') {
                    editor.chain().focus().setParagraph().run();
                } else {
                    const level = parseInt(val.replace('h', ''), 10) as 1 | 2 | 3 | 4 | 5 | 6;
                    editor.chain().focus().toggleHeading({ level }).run();
                }
            }}
        >
            <option value="p">{t('rte.text')}</option>
            <option value="h1">{t('rte.h1')}</option>
            <option value="h2">{t('rte.h2')}</option>
            <option value="h3">{t('rte.h3')}</option>
            <option value="h4">{t('rte.h4')}</option>
            <option value="h5">{t('rte.h5')}</option>
            <option value="h6">{t('rte.h6')}</option>
        </select>
    );
};

const LinkButton = ({ editor }: { editor: Editor }) => {
    const { t } = useTranslation();
    const [url, setUrl] = useState('');
    const [open, setOpen] = useState(false);

    const handleSetLink = useCallback(() => {
        if (!url) {
            editor.chain().focus().unsetLink().run();
        } else {
            const href = url.match(/^https?:\/\//) ? url : `https://${url}`;
            editor.chain().focus().setLink({ href, target: '_blank' }).run();
        }
        setUrl('');
        setOpen(false);
    }, [editor, url]);

    const handleOpen = useCallback(
        (visible: boolean) => {
            setOpen(visible);
            if (visible) {
                const existing = editor.getAttributes('link').href || '';
                setUrl(existing);
            }
        },
        [editor],
    );

    return (
        <Popover
            open={open}
            onOpenChange={handleOpen}
            trigger="click"
            content={
                <Space.Compact>
                    <Input
                        size="small"
                        placeholder="https://..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onPressEnter={handleSetLink}
                        style={{ width: 240 }}
                    />
                    <Button size="small" type="primary" onClick={handleSetLink}>
                        {t('ok') || 'OK'}
                    </Button>
                </Space.Compact>
            }
        >
            <Tooltip title="Link">
                <Button
                    size="small"
                    type="text"
                    icon={<LinkOutlined />}
                    className={editor.isActive('link') ? styles.activeButton : undefined}
                />
            </Tooltip>
        </Popover>
    );
};

export const Toolbar = ({ editor, placeholders, onInsertPlaceholder }: ToolbarProps) => {
    const { t } = useTranslation();

    return (
        <div className={styles.toolbar}>
            <div className={styles.toolbarRow}>
                <HeadingSelect editor={editor} />
                <div className={styles.toolbarGroup}>
                    <Tooltip title="Bold">
                        <Button
                            size="small"
                            type="text"
                            icon={<BoldOutlined />}
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={editor.isActive('bold') ? styles.activeButton : undefined}
                        />
                    </Tooltip>
                    <Tooltip title="Italic">
                        <Button
                            size="small"
                            type="text"
                            icon={<ItalicOutlined />}
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={editor.isActive('italic') ? styles.activeButton : undefined}
                        />
                    </Tooltip>
                    <Tooltip title="Underline">
                        <Button
                            size="small"
                            type="text"
                            icon={<UnderlineOutlined />}
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            className={editor.isActive('underline') ? styles.activeButton : undefined}
                        />
                    </Tooltip>
                    <Tooltip title="Strikethrough">
                        <Button
                            size="small"
                            type="text"
                            icon={<StrikethroughOutlined />}
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            className={editor.isActive('strike') ? styles.activeButton : undefined}
                        />
                    </Tooltip>
                </div>
                <div className={styles.toolbarGroup}>
                    <Tooltip title="Bullet List">
                        <Button
                            size="small"
                            type="text"
                            icon={<UnorderedListOutlined />}
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className={editor.isActive('bulletList') ? styles.activeButton : undefined}
                        />
                    </Tooltip>
                    <Tooltip title="Ordered List">
                        <Button
                            size="small"
                            type="text"
                            icon={<OrderedListOutlined />}
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            className={editor.isActive('orderedList') ? styles.activeButton : undefined}
                        />
                    </Tooltip>
                </div>
                <LinkButton editor={editor} />
            </div>
            {placeholders && Object.keys(placeholders).length > 0 && (
                <div className={styles.toolbarRow}>
                    <span>{t('editor.plugin.placeholder.label')}:</span>
                    <select
                        className={styles.headingSelect}
                        defaultValue=""
                        onChange={(e) => {
                            if (e.target.value) {
                                onInsertPlaceholder(e.target.value);
                                e.target.value = '';
                            }
                        }}
                    >
                        <option value="" disabled>
                            {t('editor.plugin.placeholder.select.placeholder')}
                        </option>
                        {Object.keys(placeholders).map((key) => (
                            <option key={key} value={key}>
                                {t(placeholders[key])}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

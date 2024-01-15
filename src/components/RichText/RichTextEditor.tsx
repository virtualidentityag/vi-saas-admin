import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PluginsEditor from '@draft-js-plugins/editor';
import createToolbarPlugin from '@draft-js-plugins/static-toolbar';
import { stateToHTML } from 'draft-js-export-html';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import {
    FormatBold,
    FormatItalic,
    FormatUnderlined,
    FormatListBulleted,
    FormatListNumbered,
} from '@mui/icons-material';
import {
    ContentState,
    EditorState,
    RichUtils,
    getDefaultKeyBinding,
    DraftHandleValue,
    DraftEditorCommand,
    convertFromHTML,
    Modifier,
} from 'draft-js';
import { useTranslation } from 'react-i18next';
import { Select } from 'antd';

import './RichTextEditor.styles.scss';
import { ToolbarChildrenProps } from '@draft-js-plugins/static-toolbar/lib/components/Toolbar';
import createLinkPlugin, { LinkControl } from '../../utils/draftjs/linkPlugin';
import createImagePlugin, { ImageControl } from '../../utils/draftjs/imagePlugin';
import createPlaceholderPlugin, { PlaceholderControl } from '../../utils/draftjs/placeholderPlugin/index';
import BlockStyleButton from './BlockStyleButton';
import InlineStyleButton from './InlineStyleButton';

interface OnChangeHandler {
    (e: any): void;
}

type RichTextEditorProps = {
    value: any;
    onChange: OnChangeHandler;
    placeholder: string;
    disabled?: boolean;
    className?: string;
    onFocus?: () => void;
    onBlur?: () => void;
    placeholders?: { [key: string]: string };
};

const TEXT_STYLES = [
    { label: 'rte.text', value: 'unstyled' },
    { label: 'rte.h1', value: 'header-one' },
    { label: 'rte.h2', value: 'header-two' },
    { label: 'rte.h3', value: 'header-three' },
    { label: 'rte.h4', value: 'header-four' },
    { label: 'rte.h5', value: 'header-five' },
    { label: 'rte.h6', value: 'header-six' },
];

const TextStyleSelect = ({ setEditorState, editorState }: ToolbarChildrenProps & { editorState: EditorState }) => {
    const { t } = useTranslation();
    const [selectionState, setSelectionState] = useState(() => editorState.getSelection());

    useEffect(() => {
        const selection = editorState.getSelection();
        setSelectionState((state) => {
            return selection.getHasFocus() ? selection : state;
        });
    }, [editorState]);

    const blockType = useMemo(
        () => editorState.getCurrentContent().getBlockForKey(selectionState.getStartKey()).getType(),
        [editorState, selectionState],
    );

    const handleToggle = useCallback(
        (type: string) => {
            setEditorState(
                EditorState.push(
                    editorState,
                    Modifier.setBlockType(editorState.getCurrentContent(), selectionState, type),
                    'change-block-type',
                ),
            );
        },
        [editorState, setEditorState],
    );

    return (
        <Select
            size="small"
            className="RichEditor-styleSelect"
            dropdownMatchSelectWidth={false}
            value={blockType}
            onChange={handleToggle}
            options={TEXT_STYLES.map(({ label, value }) => ({
                value,
                label: typeof label === 'string' ? t(label) : label,
            }))}
            getPopupContainer={(element: HTMLElement) => element.parentElement}
        />
    );
};

const toolbarPlugin = createToolbarPlugin();
const linkPlugin = createLinkPlugin();
const imagePlugin = createImagePlugin();

const { Toolbar } = toolbarPlugin;

const editorPlugins = [toolbarPlugin, linkPlugin, imagePlugin];

const RTE = ({
    value,
    onChange,
    placeholder,
    disabled,
    className,
    onBlur,
    onFocus,
    placeholders,
}: RichTextEditorProps) => {
    const plugins = useMemo(() => [...editorPlugins, createPlaceholderPlugin({ placeholders })], [placeholders]);

    const [editorState, setEditorState] = useState<EditorState>(() => {
        const { contentBlocks, entityMap } = convertFromHTML(value);
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        return EditorState.createWithContent(contentState);
    });

    useEffect(() => {
        setEditorState((state) => {
            const contentState = state.getCurrentContent();
            contentState.getAllEntities().forEach((entity, entityKey) => {
                contentState.mergeEntityData(entityKey, { disabled });
            });
            return EditorState.createWithContent(contentState, state.getDecorator());
        });
    }, [disabled]);

    const handleChange = useCallback(
        (edited: EditorState) => {
            setEditorState(edited);
            const contentState = edited.getCurrentContent();
            onChange(contentState.hasText() ? stateToHTML(contentState) : '');
        },
        [onChange],
    );

    // Just because the library isn't properly typed
    const extraProps = { onBlur, onFocus };

    let classN = `RichEditor-editor`;
    const contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
        if (contentState.getBlockMap().first().getType() !== 'unstyled') {
            classN += ' RichEditor-hidePlaceholder';
        }
    }

    const handleKeyCommand = useCallback((command: string, editorStat: EditorState): DraftHandleValue => {
        const newState = RichUtils.handleKeyCommand(editorStat, command);
        if (newState) {
            handleChange(newState);
            return 'handled';
        }
        return 'not-handled';
    }, []);

    const mapKeyToEditorCommand = useCallback(
        (e): DraftEditorCommand | null => {
            if (e.keyCode === 9) {
                const newEditorState = RichUtils.onTab(e, editorState, 4);
                if (newEditorState === editorState) {
                    handleChange(newEditorState);
                }
                return null;
            }
            return getDefaultKeyBinding(e);
        },
        [editorState],
    );

    const editorRef = useRef<any>();

    const focus = useCallback(() => {
        editorRef.current.focus();
    }, []);

    return (
        <div className={`RichEditor-root ${className}`}>
            {!disabled && (
                <div className="RichEditor-toolbar">
                    <Toolbar>
                        {
                            // may be use React.Fragment instead of div to improve perfomance after React 16
                            (externalProps) => (
                                <>
                                    <div className="RichEditor-controls">
                                        <div className="RichEditor-control-group">
                                            <TextStyleSelect {...externalProps} editorState={editorState} />
                                        </div>
                                        <div className="RichEditor-control-group">
                                            <InlineStyleButton
                                                {...externalProps}
                                                inlineStyle="BOLD"
                                                editorState={editorState}
                                            >
                                                <FormatBold />
                                            </InlineStyleButton>
                                            <InlineStyleButton
                                                {...externalProps}
                                                inlineStyle="ITALIC"
                                                editorState={editorState}
                                            >
                                                <FormatItalic />
                                            </InlineStyleButton>
                                            <InlineStyleButton
                                                {...externalProps}
                                                inlineStyle="UNDERLINE"
                                                editorState={editorState}
                                            >
                                                <FormatUnderlined />
                                            </InlineStyleButton>
                                        </div>
                                        <div className="RichEditor-control-group">
                                            <BlockStyleButton
                                                {...externalProps}
                                                blockType="unordered-list-item"
                                                editorState={editorState}
                                            >
                                                <FormatListBulleted />
                                            </BlockStyleButton>
                                            <BlockStyleButton
                                                {...externalProps}
                                                blockType="ordered-list-item"
                                                editorState={editorState}
                                            >
                                                <FormatListNumbered />
                                            </BlockStyleButton>
                                        </div>
                                        <div className="RichEditor-control-group">
                                            <LinkControl {...externalProps} editorState={editorState} />
                                        </div>
                                        <div className="RichEditor-control-group">
                                            <ImageControl {...externalProps} editorState={editorState} />
                                        </div>
                                    </div>
                                    {Object.keys(placeholders || {}).length > 0 && (
                                        <PlaceholderControl
                                            placeholders={placeholders}
                                            editorState={editorState}
                                            {...externalProps}
                                        />
                                    )}
                                </>
                            )
                        }
                    </Toolbar>
                </div>
            )}

            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
            <div className={classN} onClick={focus}>
                <PluginsEditor
                    ref={editorRef}
                    readOnly={disabled}
                    editorState={editorState}
                    onChange={handleChange}
                    placeholder={placeholder}
                    plugins={plugins}
                    {...extraProps}
                    handleKeyCommand={handleKeyCommand}
                    keyBindingFn={mapKeyToEditorCommand}
                />
            </div>
        </div>
    );
};

export default RTE;

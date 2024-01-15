import { ToolbarChildrenProps } from '@draft-js-plugins/static-toolbar/lib/components/Toolbar';
import React, { useCallback, useEffect, useState } from 'react';
import { ImageOutlined, Check, Clear } from '@mui/icons-material';
import { Button, Input, Tooltip } from 'antd';
import { EditorState, Modifier, SelectionState } from 'draft-js';
import './image.styles.scss';

const ImageAttributes = ({
    setEditorState,
    getEditorState,
    selectionState,
    onClose,
}: {
    setEditorState: (editorState: EditorState) => void;
    getEditorState: () => EditorState;
    selectionState: SelectionState;
    onClose: (open: boolean) => void;
}) => {
    const [src, setSrc] = useState('');

    const handleAdd = useCallback(() => {
        let imageSrc = src;
        if (!imageSrc.match(/^http(s)?:\/\//)) {
            imageSrc = `https://${imageSrc}`;
        }
        const editorState = getEditorState();
        const contentState = editorState.getCurrentContent();
        contentState.createEntity('IMAGE', 'IMMUTABLE', {
            src: imageSrc,
        });
        const entityKey = contentState.getLastCreatedEntityKey();
        setEditorState(
            EditorState.push(
                editorState,
                Modifier.insertText(contentState, selectionState, ' ', null, entityKey),
                'apply-entity',
            ),
        );
        setSrc('');
        onClose(false);
    }, [src, getEditorState, selectionState]);

    return (
        <div className="RichEditor-toolbar-image-tooltip-content">
            <div>
                <Input
                    size="small"
                    placeholder="https://www.example.com"
                    onChange={(e) => setSrc(e.target.value)}
                    value={src}
                />
            </div>
            <div className="RichEditor-toolbar-image-tooltip-actions">
                <Button
                    size="small"
                    onClick={() => {
                        setSrc('');
                        onClose(false);
                    }}
                >
                    <Clear />
                </Button>
                <Button size="small" onClick={() => handleAdd()}>
                    <Check />
                </Button>
            </div>
        </div>
    );
};

export const ImageControl = ({
    setEditorState,
    getEditorState,
    editorState,
}: ToolbarChildrenProps & { editorState: EditorState }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [selectionState, setSelectionState] = useState(() => editorState.getSelection());
    const [disabled, setDisabled] = useState(!editorState.getSelection().isCollapsed());

    useEffect(() => {
        const selection = editorState.getSelection();
        setSelectionState((state) => {
            return selection.getHasFocus() ? selection : state;
        });
        setDisabled((state) => {
            return selection.getHasFocus() ? !selection.isCollapsed() : state;
        });
    }, [editorState]);

    return (
        <div className="RichEditor-toolbar-image">
            <div>
                <Tooltip
                    overlayClassName="RichEditor-toolbar-image-tooltip"
                    title={
                        !disabled && (
                            <ImageAttributes
                                onClose={setShowTooltip}
                                setEditorState={setEditorState}
                                getEditorState={getEditorState}
                                selectionState={selectionState}
                            />
                        )
                    }
                    trigger="click"
                    color="white"
                    placement="bottom"
                    open={showTooltip}
                    onOpenChange={setShowTooltip}
                    getPopupContainer={(element: HTMLElement) => element.parentElement}
                >
                    <Button type="link" size="small" disabled={disabled}>
                        <ImageOutlined />
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
};
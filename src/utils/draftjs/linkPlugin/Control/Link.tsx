import { ToolbarChildrenProps } from '@draft-js-plugins/static-toolbar/lib/components/Toolbar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { InsertLink, LinkOff, Check, Clear } from '@mui/icons-material';
import { Button, Checkbox, Input, Tooltip } from 'antd';
import { EditorState, Modifier, SelectionState } from 'draft-js';
import './link.styles.scss';
import clsx from 'clsx';

const LinkAttributes = ({
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
    const [link, setLink] = useState('');
    const [targetBlank, setTargetBlank] = useState(false);
    const [noFollow, setNoFollow] = useState(false);

    const handleAdd = useCallback(() => {
        let hyperLink = link;
        if (!hyperLink.match(/^http(s)?:\/\//)) {
            hyperLink = `https://${hyperLink}`;
        }
        const editorState = getEditorState();
        const contentState = editorState.getCurrentContent();
        contentState.createEntity('LINK', 'MUTABLE', {
            url: hyperLink,
            target: targetBlank ? '_blank' : '_self',
            rel: noFollow ? 'noopener noreferrer' : null,
        });
        const entityKey = contentState.getLastCreatedEntityKey();
        setEditorState(
            EditorState.push(
                editorState,
                Modifier.applyEntity(contentState, selectionState, entityKey),
                'apply-entity',
            ),
        );
        setLink('');
        setNoFollow(false);
        setTargetBlank(false);
        onClose(false);
    }, [link, targetBlank, noFollow, selectionState]);

    return (
        <div className="RichEditor-toolbar-link-tooltip-content">
            <div>
                <Input
                    size="small"
                    placeholder="https://www.example.com"
                    onChange={(e) => setLink(e.target.value)}
                    value={link}
                />
            </div>
            <div>
                <Checkbox onChange={(e) => setTargetBlank(e.target.checked)} checked={targetBlank}>
                    Open link in new tab
                </Checkbox>
            </div>
            <div>
                <Checkbox onChange={(e) => setNoFollow(e.target.checked)} checked={noFollow}>
                    No follow
                </Checkbox>
            </div>
            <div className="RichEditor-toolbar-link-tooltip-actions">
                <Button
                    size="small"
                    onClick={() => {
                        setLink('');
                        setNoFollow(false);
                        setTargetBlank(false);
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

export const LinkControl = ({
    setEditorState,
    getEditorState,
    editorState,
}: ToolbarChildrenProps & { editorState: EditorState }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [selectionState, setSelectionState] = useState(() => editorState.getSelection());
    const [disabled, setDisabled] = useState(editorState.getSelection().isCollapsed());

    useEffect(() => {
        const selection = editorState.getSelection();
        setSelectionState((state) => {
            return selection.getHasFocus() ? selection : state;
        });
        setDisabled((state) => {
            return selection.getHasFocus() ? selection.isCollapsed() : state;
        });
    }, [editorState]);

    const linkEntity = useMemo(() => {
        const contentState = editorState.getCurrentContent();
        const block = editorState.getCurrentContent().getBlockForKey(selectionState.getStartKey());
        const entityKey = block.getEntityAt(selectionState.getStartOffset());
        return entityKey && contentState.getEntity(entityKey).getType() === 'LINK' ? entityKey : null;
    }, [editorState, selectionState]);

    const handleDelete = useCallback(
        (entityKey: string) => {
            const contentState = editorState.getCurrentContent();
            const block = contentState.getBlockForKey(selectionState.getStartKey());
            block.findEntityRanges(
                (character) => entityKey === character.getEntity(),
                (start, end) => {
                    const selection = SelectionState.createEmpty(block.getKey()).merge({
                        anchorOffset: start,
                        focusOffset: end,
                    });

                    setEditorState(
                        EditorState.push(
                            editorState,
                            Modifier.applyEntity(contentState, selection, null),
                            'apply-entity',
                        ),
                    );
                },
            );
        },
        [editorState],
    );

    return (
        <div className="RichEditor-toolbar-link">
            <div>
                <Tooltip
                    overlayClassName="RichEditor-toolbar-link-tooltip"
                    title={
                        !disabled && (
                            <LinkAttributes
                                onClose={setShowTooltip}
                                selectionState={selectionState}
                                setEditorState={setEditorState}
                                getEditorState={getEditorState}
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
                    <Button size="small" type="link" disabled={disabled}>
                        <InsertLink />
                    </Button>
                </Tooltip>
            </div>
            <div>
                <Button onClick={() => handleDelete(linkEntity)} type="link" size="small" disabled={!linkEntity}>
                    <LinkOff />
                </Button>
            </div>
        </div>
    );
};

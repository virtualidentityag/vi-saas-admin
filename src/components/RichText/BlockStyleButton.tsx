/* eslint-disable react/no-children-prop */
import clsx from 'clsx';
import { EditorState, RichUtils } from 'draft-js';
import React, { MouseEvent, ReactNode, useCallback, useMemo } from 'react';
import { DraftJsStyleButtonProps } from '@draft-js-plugins/buttons';
import { Button } from 'antd';
import { ButtonType } from 'antd/lib/button/button';

interface ButtonProps extends DraftJsStyleButtonProps {
    type: ButtonType;
}

interface CreateBlockStyleButtonProps extends Omit<DraftJsStyleButtonProps, 'buttonProps'> {
    blockType: string;
    children: ReactNode;
    editorState: EditorState;
    buttonProps?: ButtonProps;
}

const BlockStyleButton = ({
    blockType,
    children,
    theme,
    buttonProps,
    setEditorState,
    editorState,
}: CreateBlockStyleButtonProps) => {
    const toggleStyle = useCallback(
        (event: MouseEvent): void => {
            event.preventDefault();
            setEditorState(RichUtils.toggleBlockType(editorState, blockType));
        },
        [editorState, setEditorState],
    );

    const preventBubblingUp = useCallback((event: MouseEvent): void => {
        event.preventDefault();
    }, []);

    const blockTypeIsActive = useMemo((): boolean => {
        // if the button is rendered before the editor
        if (!editorState) {
            return false;
        }

        const type = editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getStartKey()).getType();
        return type === blockType;
    }, [editorState]);

    const className = blockTypeIsActive ? clsx(theme.button, theme.active) : theme.button;

    return (
        <Button
            children={children}
            className={className}
            onMouseDown={preventBubblingUp}
            onClick={toggleStyle}
            size="small"
            role="button"
            aria-label={`create ${blockType}`}
            {...buttonProps}
        />
    );
};
export default BlockStyleButton;

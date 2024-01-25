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

interface CreateInlineStyleButtonProps extends Omit<DraftJsStyleButtonProps, 'buttonProps'> {
    inlineStyle: string;
    children: ReactNode;
    editorState: EditorState;
    buttonProps?: ButtonProps;
}

const InlineStyleButton = ({
    inlineStyle,
    children,
    theme,
    buttonProps,
    setEditorState,
    editorState,
}: CreateInlineStyleButtonProps) => {
    const toggleStyle = useCallback(
        (event: MouseEvent): void => {
            event.preventDefault();
            setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
        },
        [editorState, setEditorState],
    );

    const preventBubblingUp = useCallback((event: MouseEvent): void => {
        event.preventDefault();
    }, []);

    const styleIsActive = useMemo((): boolean => {
        return editorState && editorState.getCurrentInlineStyle().has(inlineStyle);
    }, [editorState]);

    const className = styleIsActive ? clsx(theme.button, theme.active) : theme.button;

    return (
        <Button
            children={children}
            className={className}
            onMouseDown={preventBubblingUp}
            onClick={toggleStyle}
            size="small"
            role="button"
            aria-label={`${inlineStyle} text`}
            {...buttonProps}
        />
    );
};
export default InlineStyleButton;

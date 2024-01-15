import React, { ReactElement, ReactNode, useCallback } from 'react';
import { CloseCircleFilled } from '@ant-design/icons';
import { ContentState, EditorState, Modifier, SelectionState } from 'draft-js';
import { OrderedSet } from 'immutable';
import styles from '../theme.module.scss';

export interface PlaceholderProps {
    children: ReactNode;
    entityKey?: string;
    offsetKey?: unknown;
    contentState?: ContentState;
    onDelete?: any;
    getEditorState?: () => EditorState;
    setEditorState?: (editorState: EditorState) => void;
    start?: number;
    end?: number;
    blockKey?: string;
    decoratedText?: string;
}

// The component we render when we encounter a hyperlink in the text
const Placeholder = (props: PlaceholderProps): ReactElement => {
    const {
        children,
        entityKey,
        offsetKey,
        contentState,
        onDelete,
        getEditorState,
        setEditorState,
        start,
        end,
        blockKey,
        decoratedText,
        ...otherProps
    } = props;

    const { disabled } = contentState.getEntity(entityKey).getData();

    const handleDelete = useCallback(() => {
        let newContentState = contentState;

        let block = newContentState.getBlockForKey(blockKey);
        const selectionState = SelectionState.createEmpty(block.getKey()).merge({
            anchorOffset: start,
            focusOffset: end,
        });
        newContentState = Modifier.replaceText(newContentState, selectionState, '', OrderedSet(['INSERT']), null);

        block = newContentState.getBlockForKey(blockKey);
        // if block is empty after remove, remove the block too
        if (block.getText().trim() === '') {
            const nextBlock = newContentState.getBlockAfter(block.getKey());
            const removeSelection = new SelectionState({
                anchorKey: block.getKey(),
                anchorOffset: 0,
                focusKey: nextBlock.getKey(),
                focusOffset: 0,
            });
            newContentState = Modifier.removeRange(newContentState, removeSelection, 'backward');
        }

        setEditorState(EditorState.push(getEditorState(), newContentState, 'remove-range'));
    }, []);

    return (
        <span className={styles.placeholder} contentEditable={false} data-offset-key={offsetKey} {...otherProps}>
            <span contentEditable={false}>{children}</span>
            {!disabled && (
                /* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
                <span contentEditable={false} className={styles['placeholder--delete']} onClick={handleDelete}>
                    <CloseCircleFilled />
                </span>
            )}
        </span>
    );
};

export default Placeholder;
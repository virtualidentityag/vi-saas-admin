import { ToolbarChildrenProps } from '@draft-js-plugins/static-toolbar/lib/components/Toolbar';
import React, { useCallback, useEffect, useState } from 'react';
import { EditorState, Modifier, SelectionState } from 'draft-js';
import { Select, Tooltip } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export const PlaceholderControl = ({
    placeholders,
    setEditorState,
    getEditorState,
    editorState,
    selectionState,
}: ToolbarChildrenProps & { placeholders: any; editorState: EditorState; selectionState: SelectionState }) => {
    const { t } = useTranslation();
    const [disabled, setDisabled] = useState(!editorState.getSelection().isCollapsed());

    useEffect(() => {
        const selection = editorState.getSelection();
        setDisabled((state) => {
            return selection.getHasFocus() ? !selection.isCollapsed() : state;
        });
    }, [editorState]);

    const insertPlaceholder = useCallback(
        (key: string) => {
            const state = getEditorState();
            const selection = SelectionState.createEmpty(selectionState.getStartKey()).merge({
                anchorOffset: selectionState.getAnchorOffset(),
                focusOffset: selectionState.getFocusOffset(),
            });

            const contentState = state.getCurrentContent();
            const contentStateWithEntity = contentState.createEntity('PLACEHOLDER', 'IMMUTABLE', {
                key,
                disabled,
            });

            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            const modifiedContent = Modifier.insertText(contentState, selection, `\${${key}}`, null, entityKey);

            setEditorState(EditorState.push(state, modifiedContent, 'apply-entity'));
        },
        [disabled],
    );

    return (
        <div className="RichEditor-toolbar-placeholder">
            <div>{t('editor.plugin.placeholder.label')}:</div>
            <div>
                <Tooltip
                    overlayClassName="RichEditor-toolbar-placeholder-tooltip"
                    title={t('editor.plugin.placeholder.tooltip.title')}
                    trigger="hover"
                    color="white"
                >
                    <InfoCircleFilled />
                </Tooltip>
            </div>
            <div>
                <Select
                    size="small"
                    placeholder={t('editor.plugin.placeholder.select.placeholder')}
                    dropdownMatchSelectWidth={false}
                    value={null}
                    disabled={disabled}
                    onChange={insertPlaceholder}
                    options={Object.keys(placeholders).map((p) => ({
                        label: t(placeholders[p]),
                        value: p,
                    }))}
                />
            </div>
        </div>
    );
};

import { ToolbarChildrenProps } from '@draft-js-plugins/static-toolbar/lib/components/Toolbar';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { EditorState, Modifier, SelectionState } from 'draft-js';
import { Tooltip } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export const PlaceholderControl = ({
    placeholders,
    setEditorState,
    getEditorState,
    selectionState,
}: ToolbarChildrenProps & { placeholders: Record<string, string>; selectionState: SelectionState }) => {
    const { t } = useTranslation();
    const [disabled, setDisabled] = useState(!selectionState || !selectionState.isCollapsed());

    useEffect(() => {
        setDisabled((state) => {
            return selectionState && selectionState.getHasFocus() ? !selectionState.isCollapsed() : state;
        });
    }, [selectionState]);

    const insertPlaceholder = useCallback(
        (e: ChangeEvent<HTMLSelectElement>) => {
            const key = e.target.value;
            if (!key || !selectionState) return;
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

            // Add placeholder to state and force selection after the placeholder
            setEditorState(
                EditorState.forceSelection(
                    EditorState.push(state, modifiedContent, 'apply-entity'),
                    SelectionState.createEmpty(selectionState.getStartKey()).merge({
                        anchorOffset: selection.getAnchorOffset() + `\${${key}}`.length,
                        focusOffset: selection.getFocusOffset() + `\${${key}}`.length,
                    }),
                ),
            );

            // Reset to placeholder option after inserting
            e.target.value = '';
        },
        [disabled, selectionState, getEditorState],
    );

    return (
        <div className="RichEditor-toolbar-placeholder">
            <div>{t('editor.plugin.placeholder.label')}:</div>
            <div>
                <Tooltip
                    className="RichEditor-toolbar-placeholder-tooltip"
                    title={t('editor.plugin.placeholder.tooltip.title')}
                    trigger="hover"
                    color="white"
                >
                    <InfoCircleFilled />
                </Tooltip>
            </div>
            <div>
                <select
                    className="RichEditor-styleSelect"
                    disabled={disabled}
                    defaultValue=""
                    onChange={insertPlaceholder}
                >
                    <option value="" disabled>
                        {t('editor.plugin.placeholder.select.placeholder')}
                    </option>
                    {Object.keys(placeholders).map((p) => (
                        <option key={p} value={p}>
                            {t(placeholders[p])}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

import { ToolbarChildrenProps } from '@draft-js-plugins/static-toolbar/lib/components/Toolbar';
import React, { useCallback, useEffect, useState } from 'react';
import { EditorState, Modifier, SelectionState } from 'draft-js';
import { Select, Tooltip } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';

export const PlaceholderControl = ({
    placeholders,
    setEditorState,
    getEditorState,
    editorState,
}: ToolbarChildrenProps & { placeholders: any; editorState: EditorState }) => {
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
            <div>Kontakt-Platzhalter:</div>
            <div>
                <Tooltip
                    overlayClassName="RichEditor-toolbar-placeholder-tooltip"
                    title="Sie können in Ihrer Datenschutzerklärung Kontaktplatzhalter für die verantwortliche Stelle und den Datenschutzbeauftragten verwenden. Diese Kontaktdaten werden von der jeweiligen Beratungsstelle übernommen und den Ratsuchenden angezeigt, die sich bei dieser Beratungsstelle registriert haben."
                    trigger="hover"
                    color="white"
                >
                    <InfoCircleFilled />
                </Tooltip>
            </div>
            <div>
                <Select
                    size="small"
                    placeholder="Platzhalter wählen"
                    dropdownMatchSelectWidth={false}
                    value={null}
                    disabled={disabled}
                    onChange={insertPlaceholder}
                    options={Object.keys(placeholders).map((p) => ({
                        label: placeholders[p],
                        value: p,
                    }))}
                />
            </div>
        </div>
    );
};

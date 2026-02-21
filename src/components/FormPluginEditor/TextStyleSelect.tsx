import { ToolbarChildrenProps } from '@draft-js-plugins/static-toolbar/lib/components/Toolbar';
import { EditorState, Modifier, SelectionState } from 'draft-js';
import { useTranslation } from 'react-i18next';
import { ChangeEvent, useCallback, useMemo } from 'react';

const TEXT_STYLES = [
    { label: 'rte.text', value: 'unstyled' },
    { label: 'rte.h1', value: 'header-one' },
    { label: 'rte.h2', value: 'header-two' },
    { label: 'rte.h3', value: 'header-three' },
    { label: 'rte.h4', value: 'header-four' },
    { label: 'rte.h5', value: 'header-five' },
    { label: 'rte.h6', value: 'header-six' },
];

const TextStyleSelect = ({
    setEditorState,
    getEditorState,
    selectionState,
}: ToolbarChildrenProps & { selectionState: SelectionState }) => {
    const { t } = useTranslation();

    const blockType = useMemo(
        () =>
            selectionState &&
            getEditorState().getCurrentContent().getBlockForKey(selectionState.getStartKey()).getType(),
        [selectionState, getEditorState],
    );

    const handleToggle = useCallback(
        (e: ChangeEvent<HTMLSelectElement>) => {
            const type = e.target.value;
            setEditorState(
                EditorState.push(
                    getEditorState(),
                    Modifier.setBlockType(getEditorState().getCurrentContent(), selectionState, type),
                    'change-block-type',
                ),
            );
        },
        [setEditorState, getEditorState, selectionState],
    );

    return (
        <select
            className="RichEditor-styleSelect"
            disabled={!blockType}
            value={blockType || ''}
            onChange={handleToggle}
        >
            {TEXT_STYLES.map(({ label, value }) => (
                <option key={value} value={value}>
                    {t(label)}
                </option>
            ))}
        </select>
    );
};
export default TextStyleSelect;

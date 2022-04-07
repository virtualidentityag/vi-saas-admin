import React, { useState } from "react";
import RichTextEditor, { EditorValue, ToolbarConfig } from "react-rte";
import i18next from "i18next";

const toolbarConfig: ToolbarConfig = {
  // Optionally specify the groups to display (displayed in the order listed).
  display: [
    "BLOCK_TYPE_DROPDOWN",
    "INLINE_STYLE_BUTTONS",
    "BLOCK_TYPE_BUTTONS",
    "LINK_BUTTONS",
    "IMAGE_BUTTON",
  ],
  INLINE_STYLE_BUTTONS: [
    { label: "Bold", style: "BOLD", className: "custom-css-class" },
    { label: "Italic", style: "ITALIC" },
    { label: "Underline", style: "UNDERLINE" },
  ],
  BLOCK_TYPE_DROPDOWN: [
    { label: i18next.t("rte.text"), style: "unstyled" },
    { label: i18next.t("rte.h1"), style: "header-one" },
    { label: i18next.t("rte.h2"), style: "header-two" },
    { label: i18next.t("rte.h3"), style: "header-three" },
    { label: i18next.t("rte.h4"), style: "header-four" },
  ],
  BLOCK_TYPE_BUTTONS: [
    { label: "UL", style: "unordered-list-item" },
    { label: "OL", style: "ordered-list-item" },
  ],
};

interface OnChangeHandler {
  (e: any): void;
}

type RichTextEditorProps = {
  value: any;
  onChange: OnChangeHandler;
  placeholder: string;
};

function RTE({ value, onChange, placeholder }: RichTextEditorProps) {
  const [editorState, setEditorState] = useState(() =>
    RichTextEditor.createValueFromString(value, "html")
  );

  const handleChange = (edited: EditorValue) => {
    setEditorState(edited);
    onChange(edited);
  };

  return (
    <RichTextEditor
      value={editorState}
      onChange={handleChange}
      toolbarConfig={toolbarConfig}
      className="rte"
      placeholder={placeholder}
    />
  );
}

export default RTE;

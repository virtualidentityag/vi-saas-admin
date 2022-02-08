import React, { useState } from "react";
import RichTextEditor, { EditorValue, ToolbarConfig } from "react-rte";

const toolbarConfig: ToolbarConfig = {
  // Optionally specify the groups to display (displayed in the order listed).
  display: [
    "INLINE_STYLE_BUTTONS",
    "BLOCK_TYPE_DROPDOWN",
    "BLOCK_TYPE_BUTTONS",
    "LINK_BUTTONS",
  ],
  INLINE_STYLE_BUTTONS: [
    { label: "Bold", style: "BOLD", className: "custom-css-class" },
    { label: "Italic", style: "ITALIC" },
    { label: "Underline", style: "UNDERLINE" },
  ],
  BLOCK_TYPE_DROPDOWN: [
    { label: "Normal", style: "unstyled" },
    { label: "Heading Medium", style: "header-two" },
    { label: "Heading Small", style: "header-three" },
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

import React from "react";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import CustomPencilIcon from "../CustomIcons/Pencil";
import CustomRecycleIcon from "../CustomIcons/RecycleBin";
import { EditButtonsProps } from "../../types/editabletable";

function EditButtons({
  editable,
  handleEdit,
  handleDelete,
  record,
  cancel,
  editingKey,
  edit,
}: EditButtonsProps) {
  return editable ? (
    <div className="editBtnWrapper">
      <button
        className="editIcon saveIcon"
        type="button"
        onClick={() => handleEdit(record)}
      >
        <SaveOutlined />
      </button>
      <button className="editIcon" type="button" onClick={cancel}>
        <CloseOutlined />
      </button>
    </div>
  ) : (
    <div className="editBtnWrapper">
      <button
        className="editIcon"
        type="button"
        disabled={editingKey !== ""}
        onClick={() => edit(record)}
      >
        <CustomPencilIcon />
      </button>
      <button
        className="editIcon deletIcon"
        type="button"
        disabled={editingKey !== ""}
        onClick={() => {
          handleDelete(record);
        }}
      >
        <CustomRecycleIcon className="editIcon" />
      </button>
    </div>
  );
}

export default EditButtons;

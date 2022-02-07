import React from "react";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import CustomPencilIcon from "../CustomIcons/Pencil";
import CustomRecycleIcon from "../CustomIcons/RecycleBin";
import { EditButtonsProps } from "../../types/editButtons";

function EditButtons({
  editable,
  handleEditCounselor,
  handleDeleteCounselor,
  record,
  cancel,
  editingKey,
  edit,
}: EditButtonsProps) {
  return editable ? (
    <span>
      <button
        className="editIcon"
        type="button"
        onClick={() => handleEditCounselor(record)}
      >
        <SaveOutlined />
      </button>
      <button className="editIcon" type="button" onClick={cancel}>
        <CloseOutlined />
      </button>
    </span>
  ) : (
    <>
      <button
        className="editIcon"
        type="button"
        disabled={editingKey !== ""}
        onClick={() => edit(record)}
      >
        <CustomPencilIcon />
      </button>
      <button
        className="editIcon"
        type="button"
        disabled={editingKey !== ""}
        onClick={() => handleDeleteCounselor(record)}
      >
        <CustomRecycleIcon className="editIcon" />
      </button>
    </>
  );
}

export default EditButtons;

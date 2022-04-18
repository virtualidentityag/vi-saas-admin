import React from "react";
import CustomPencilIcon from "../CustomIcons/Pencil";
import CustomRecycleIcon from "../CustomIcons/RecycleBin";
import { EditButtonsProps } from "../../types/editabletable";

function EditButtons({
  handleEdit,
  handleDelete,
  record,
  isDisabled,
}: EditButtonsProps) {
  const disabled = isDisabled ? "disabled" : "";
  const handleEditAction = isDisabled ? () => {} : handleEdit;
  const handleDeleteAction = isDisabled ? () => {} : handleDelete;

  return (
    <div className="editBtnWrapper">
      <button
        className={`editIcon saveIcon ${disabled}`}
        type="button"
        onClick={() => handleEditAction(record)}
      >
        <CustomPencilIcon color="red" />
      </button>
      <button
        className={`editIcon deleteIcon ${disabled}`}
        type="button"
        onClick={() => {
          handleDeleteAction(record);
        }}
      >
        <CustomRecycleIcon style={{ color: "red" }} />
      </button>
    </div>
  );
}

export default EditButtons;

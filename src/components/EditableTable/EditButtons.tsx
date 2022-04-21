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
  const errorColor = "#FF0000";

  return (
    <div className="editBtnWrapper">
      <button
        className={`editIcon saveIcon ${disabled}`}
        type="button"
        onClick={() => handleEditAction(record)}
      >
        <CustomPencilIcon color={errorColor} />
      </button>
      <button
        className={`editIcon deleteIcon ${disabled}`}
        type="button"
        onClick={() => {
          handleDeleteAction(record);
        }}
      >
        <CustomRecycleIcon style={{ color: errorColor }} />
      </button>
    </div>
  );
}

export default EditButtons;

import React from "react";
import CustomPencilIcon from "../CustomIcons/Pencil";
import CustomRecycleIcon from "../CustomIcons/RecycleBin";
import { EditButtonsProps } from "../../types/editabletable";

function EditButtons({
  handleEdit,
  handleDelete,
  record,
  isDisabled,
  hide,
}: EditButtonsProps) {
  const disabled = isDisabled ? "disabled" : "";
  const handleEditAction = isDisabled ? () => {} : handleEdit;
  const handleDeleteAction = isDisabled ? () => {} : handleDelete;
  const errorColor = "#FF0000";
  const hiddenElements = hide || [];

  return (
    <div className="editBtnWrapper">
      {!hiddenElements.includes("edit") && (
        <button
          className={`editIcon saveIcon ${disabled}`}
          type="button"
          onClick={() => handleEditAction(record)}
        >
          <CustomPencilIcon color={errorColor} />
        </button>
      )}
      {!hiddenElements.includes("delete") && (
        <button
          className={`editIcon deleteIcon ${disabled}`}
          type="button"
          onClick={() => {
            handleDeleteAction(record);
          }}
        >
          <CustomRecycleIcon style={{ color: errorColor }} />
        </button>
      )}
    </div>
  );
}

export default EditButtons;

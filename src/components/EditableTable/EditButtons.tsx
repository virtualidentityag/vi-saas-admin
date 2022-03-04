import React from "react";
import CustomPencilIcon from "../CustomIcons/Pencil";
import CustomRecycleIcon from "../CustomIcons/RecycleBin";
import { EditButtonsProps } from "../../types/editabletable";

function EditButtons({ handleEdit, handleDelete, record }: EditButtonsProps) {
  return (
    <div className="editBtnWrapper">
      <button
        className="editIcon saveIcon"
        type="button"
        onClick={() => handleEdit(record)}
      >
        <CustomPencilIcon />
      </button>
      <button
        className="editIcon deleteIcon"
        type="button"
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

import { Dispatch, SetStateAction } from "react";
import { CounselorData } from "./counselor";
import { BasicTenantData } from "./tenant";

export type EditableData = CounselorData | BasicTenantData;

export default interface EditableTableProps {
  handleBtnAdd: (formData: any) => void;
  isLoading: boolean;
  source: any[];
  columns: any[];
  isDeleteModalVisible: boolean;
  handleOnDelete: (formData: any) => void;
  handleDeleteModalCancel: (formData: any) => void;
  handleDeleteModalTitle: string;
  handleDeleteModalText: string;
  handlePagination: Dispatch<SetStateAction<number>>;
  page: number;
  allowedNumberOfUsers: number | false;
}

export interface EditButtonsProps extends React.HTMLAttributes<HTMLElement> {
  handleEdit: (formData: EditableData) => void;
  handleDelete: (formData: EditableData) => void;
  record: CounselorData | BasicTenantData;
  isDisabled?: boolean;
}

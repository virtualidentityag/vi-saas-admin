import { CounselorData } from "./counselor";
import { TenantData } from "./tenant";

export type EditableData = CounselorData | TenantData;

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
  handlePagination: SetStateAction<number>;
  page: number;
  allowedNumberOfUsers: number | false;
}

export interface EditButtonsProps extends React.HTMLAttributes<HTMLElement> {
  handleEdit: (formData: EditableData) => void;
  handleDelete: (formData: EditableData) => void;
  record: CounselorData;
}

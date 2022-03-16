import { CounselorData } from "./counselor";

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
}

export interface EditButtonsProps extends React.HTMLAttributes<HTMLElement> {
  handleEdit: (formData: CounselorData) => void;
  handleDelete: (formData: CounselorData) => void;
  record: CounselorData;
}

import { FormInstance } from "antd";
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
  form: FormInstance;
  handlePagination: SetStateAction<number>;
  page: number;
}

export interface EditableTableCellProps {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: Item;
  index: number;
  children: React.ReactNode;
}

export interface EditButtonsProps extends React.HTMLAttributes<HTMLElement> {
  editable: boolean;
  handleEdit: (formData: CounselorData) => void;
  handleDelete: (formData: CounselorData) => void;
  record: CounselorData;
  cancel: () => void;
  editingKey: string;
  edit: (formData: CounselorData) => void;
}

import { CounselorData } from "./counselor";

interface EditButtonsProps extends React.HTMLAttributes<HTMLElement> {
  editable: boolean;
  handleEditCounselor: (formData: CounselorData) => void;
  handleDeleteCounselor: (formData: CounselorData) => void;
  record: CounselorData;
  cancel: () => void;
  editingKey: string;
  edit: (formData: CounselorData) => void;
}

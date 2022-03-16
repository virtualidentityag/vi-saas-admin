export interface CounselorData {
  lastname: string;
  firstname: string;
  email: string;
  active: boolean;
  gender: string;
  id: string;
  phone: string;
  agency: Record<string, any>[];
  username: string;
  key: string;
  formalLanguage: boolean;
  absent: boolean;
  absenceMessage?: string;
  deleteDate?: string;
}

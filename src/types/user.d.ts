export interface UserData {
  lastName: string;
  firstName: string;
  email: string;
  active: boolean;
  gender: string;
  id: number | null;
  phone: string;
  agency?: string;
  username: string;
  tenantId: number | null;
}

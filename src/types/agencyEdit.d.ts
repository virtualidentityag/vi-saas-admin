export interface AgencyEditData {
  id: number;
  name: string;
  description: string;
  url: string;
  duration: number;
  advisor: string;
  location: string;
  status?: string | undefined;
}

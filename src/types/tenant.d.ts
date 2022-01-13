export interface TenantData {
  id: number | null;
  name: string;
  subdomain: string;
  createDate?: string;
  updateDate: string;
  licensing: {
    allowedNumberOfUsers: number | null;
  };
  theming: {
    logo: string;
    favicon: string;
    primaryColor: string;
    secondaryColor: string;
  };
  content: {
    impressum: string;
    claim: string;
  };
}

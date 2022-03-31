export interface BasicTenantData {
  id: number | null;
  key?: number | null;
  name: string;
  subdomain?: string;
  createDate?: string;
  updateDate?: string;
  licensing?: {
    allowedNumberOfUsers: number | 0;
  };
}

export interface TenantData extends BasicTenantData {
  theming: {
    logo: string;
    favicon: string;
    primaryColor: string;
    secondaryColor: string;
  };
  content: {
    impressum: string;
    privacy: string;
    termsAndConditions: string;
    claim: string;
  };
}

export interface BasicTenantData {
  id: number | null;
  key?: number | null;
  name: string;
  subdomain?: string;
  createDate?: string;
  startServiceDate?: string; // show startServiceDate instead of createDate
  updateDate?: string;
  isSuperAdmin: boolean;
  licensing?: {
    allowedNumberOfUsers: number | 0;
    videoFeature?: boolean;
  };
  consultingType?: string;
  twoFactorAuth?: boolean; // to-do: toggeable for different usertypes (consultants and advice seekers)
  formalLanguage?: boolean;
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

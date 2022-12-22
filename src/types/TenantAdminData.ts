import { BasicTenantData } from './tenant';

export interface TenantAdminData extends BasicTenantData {
    theming: {
        logo: string;
        favicon: string;
        primaryColor: string;
        secondaryColor: string | null;
    };
    content: {
        impressum: Record<string, string>;
        privacy: Record<string, string>;
        termsAndConditions: Record<string, string>;
        claim: Record<string, string>;
        confirmTermsAndConditions: boolean;
        confirmPrivacy: boolean;
    };
}

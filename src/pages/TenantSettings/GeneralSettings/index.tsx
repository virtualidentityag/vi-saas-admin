import { GeneralSettings } from '../../../components/Tenants/GeneralSettings';
import { useTenantData } from '../../../hooks/useTenantData.hook';

export const GeneralSettingsPage = () => {
    const { data } = useTenantData();
    return <GeneralSettings tenantId={`${data?.id}`} />;
};

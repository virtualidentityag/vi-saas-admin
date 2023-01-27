import { useParams } from 'react-router';
import { GeneralSettings } from '../../../TenantSettings/GeneralSettings';

export const TenantThemeSettings = () => {
    const { id } = useParams();

    return <GeneralSettings tenantId={id} />;
};

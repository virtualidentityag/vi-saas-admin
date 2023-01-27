import { ReleaseToggle } from '../../enums/ReleaseToggle';
import { useTenantAdminData } from '../../hooks/useTenantAdminData.hook';

interface FeatureFlagProps {
    children: JSX.Element;
    feature: ReleaseToggle;
}

export const FeatureEnabled = ({ children, feature }: FeatureFlagProps): JSX.Element => {
    const { data } = useTenantAdminData();

    return data?.settings?.releaseToggles?.[feature] ? children : null;
};

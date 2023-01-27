import { useCallback } from 'react';
import { ReleaseToggle } from '../enums/ReleaseToggle';
import { useTenantAdminData } from './useTenantAdminData.hook';

export const useReleasesToggle = () => {
    const { data } = useTenantAdminData();

    const isEnabled = useCallback(
        (toggle: ReleaseToggle) => {
            return !!data?.settings?.releaseToggles?.[toggle];
        },
        [data?.settings?.releaseToggles],
    );

    return { isEnabled };
};

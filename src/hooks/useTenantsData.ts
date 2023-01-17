import { useQuery, UseQueryOptions } from 'react-query';
import { getTenantList } from '../api/tenant/getTenantListData';
import { SimpleTenant } from '../types/SimpleTenant';

interface TenantsProps extends UseQueryOptions<SimpleTenant[]> {
    search?: string;
    perPage?: number;
    page?: number;
}

export const useTenantsData = ({ page, search, perPage, ...options }: TenantsProps) => {
    return useQuery<SimpleTenant[]>(
        ['TENANTS', page, perPage, search],
        () => getTenantList(page, perPage, search),
        options,
    );
};

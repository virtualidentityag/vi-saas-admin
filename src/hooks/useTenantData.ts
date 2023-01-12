import { useQuery, UseQueryOptions } from 'react-query';
import { getTenantList } from '../api/tenant/getTenantListData';
import { SimpleTenant } from '../types/SimpleTenant';

interface TenantsProps extends UseQueryOptions<SimpleTenant[]> {
    search?: string;
    page?: number;
}
export const useTenantsData = ({ page, search, ...options }: TenantsProps) => {
    return useQuery<SimpleTenant[]>(['TENANTS', page, search], () => getTenantList(page, search), options);
};

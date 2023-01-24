import { useQuery, UseQueryOptions } from 'react-query';
import { getSingleTenantData } from '../api/tenant/getSingleTenantData';
import { SimpleTenant } from '../types/SimpleTenant';

interface TenantsProps extends UseQueryOptions<SimpleTenant> {
    id: string;
}

export const TENANT_QUERY_KEY = 'TENANT';
export const useSingleTenantData = ({ id, ...options }: TenantsProps) => {
    return useQuery<SimpleTenant>([TENANT_QUERY_KEY, Number(id)], () => getSingleTenantData(id), options);
};

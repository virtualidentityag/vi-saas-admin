import { useQuery, UseQueryOptions } from 'react-query';
import { getSingleTenantData } from '../api/tenant/getSingleTenantData';
import { SimpleTenant } from '../types/SimpleTenant';

interface TenantsProps extends UseQueryOptions<SimpleTenant> {
    id: string;
}

export const useTenantFor = ({ id, ...options }: TenantsProps) => {
    return useQuery<SimpleTenant>(['TENANT', id], () => getSingleTenantData(id), options);
};

import mergeWith from 'lodash.mergewith';
import { useMutation, useQueryClient } from 'react-query';
import { fetchData, FETCH_METHODS } from '../api/fetchData';
import { tenantAdminEndpoint } from '../appConfig';
import { TenantAdminData } from '../types/TenantAdminData';
import { TENANT_ADMIN_DATA_KEY, useTenantAdminData } from './useTenantAdminData.hook';
import { useTenantData } from './useTenantData.hook';

export const useTenantAdminDataMutation = () => {
    const queryClient = useQueryClient();
    const { data: tenantData } = useTenantData();
    const { data: tenantAdminData } = useTenantAdminData();

    return useMutation(
        (data: Partial<TenantAdminData>) => {
            return fetchData({
                url: `${tenantAdminEndpoint}${tenantData.id}`,
                method: FETCH_METHODS.PUT,
                skipAuth: false,
                bodyData: JSON.stringify(
                    mergeWith(tenantAdminData, data, (objValue, srcValue) => {
                        return objValue instanceof Array ? srcValue : undefined;
                    }),
                ),
                responseHandling: [],
            });
        },
        {
            onSuccess: (_, updatedData) => {
                queryClient.setQueryData(
                    TENANT_ADMIN_DATA_KEY,
                    mergeWith(tenantAdminData, updatedData, (objValue, srcValue) => {
                        return objValue instanceof Array ? srcValue : undefined;
                    }),
                );
            },
        },
    );
};

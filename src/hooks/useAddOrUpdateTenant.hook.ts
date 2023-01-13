import { useMutation, UseMutationOptions } from 'react-query';
import { fetchData, FETCH_ERRORS, FETCH_METHODS, FETCH_SUCCESS } from '../api/fetchData';
import { tenantAdminEndpoint } from '../appConfig';
import { SimpleTenant } from '../types/SimpleTenant';
import { useTenantFor } from './useTenantFor';

interface UseAddOrUpdateTenantOptions extends UseMutationOptions<SimpleTenant, Error, SimpleTenant, Error | Response> {
    id?: string;
}

export const useAddOrUpdateTenant = ({ id, ...options }: UseAddOrUpdateTenantOptions) => {
    const { data } = useTenantFor({ id, enabled: !!id });
    return useMutation((formData) => {
        const bodyData = JSON.stringify({
            ...data,
            name: formData.name,
            subdomain: formData.subdomain,
            licensing: {
                ...formData.licensing,
            },
        });

        if (id) {
            return fetchData({
                url: `${tenantAdminEndpoint}/${id}`,
                method: FETCH_METHODS.PUT,
                responseHandling: [FETCH_ERRORS.CATCH_ALL],
                bodyData,
            });
        }
        return fetchData({
            url: tenantAdminEndpoint,
            method: FETCH_METHODS.POST,
            responseHandling: [FETCH_ERRORS.CATCH_ALL, FETCH_SUCCESS.CONTENT],
            bodyData,
        });
    }, options);
};

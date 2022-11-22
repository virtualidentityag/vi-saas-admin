import { tenantEndpoint } from '../../appConfig';

import { FETCH_ERRORS, FETCH_METHODS, fetchData } from '../fetchData';
import { BasicTenantData } from '../../types/tenant';

/**
 * retrieve all tenants data
 * @return {Promise}
 */
const getMultipleTenants = (page: string) => {
    // retrieve Tenants
    return fetchData({
        url: `${tenantEndpoint}?page=${page}&perPage=20`,
        method: FETCH_METHODS.GET,
        skipAuth: false,
        responseHandling: [FETCH_ERRORS.CATCH_ALL],
    }).then((result) => {
        return result.map((tenant: BasicTenantData) => {
            const newTenant = { ...tenant };
            newTenant.key = tenant.id;
            return newTenant;
        });
    });
};

export default getMultipleTenants;

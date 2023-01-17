import { tenantEndpoint } from '../../appConfig';

import { FETCH_ERRORS, FETCH_METHODS, fetchData } from '../fetchData';

/**
 * retrieve all tenants data
 * @return {Promise}
 */
export const getTenantList = (page: string | number, perPage = 20, search?: string) => {
    // retrieve Tenants
    return fetchData({
        url: `${tenantEndpoint}?page=${page || 1}&perPage=${perPage}&name=${search || ''}`,
        method: FETCH_METHODS.GET,
        skipAuth: false,
        responseHandling: [FETCH_ERRORS.CATCH_ALL],
    });
};

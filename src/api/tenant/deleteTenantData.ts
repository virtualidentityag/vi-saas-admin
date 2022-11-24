import { FETCH_ERRORS, FETCH_METHODS, fetchData } from '../fetchData';
import { tenantEndpoint } from '../../appConfig';
import { BasicTenantData } from '../../types/tenant';

/**
 * delete counselor
 * @param tenantData
 * @return data
 */
const deleteTenantData = (tenantData: BasicTenantData) => {
    const { id } = tenantData;

    const tenant = fetchData({
        url: `${tenantEndpoint}/${id}`,
        method: FETCH_METHODS.DELETE,
        skipAuth: false,
        responseHandling: [FETCH_ERRORS.CATCH_ALL],
    });

    return tenant;
};

export default deleteTenantData;

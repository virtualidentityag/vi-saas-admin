import { adminEndpoint } from '../../appConfig';

import { FETCH_ERRORS, FETCH_METHODS, fetchData } from '../fetchData';

export const DEFAULT_ROLE = 'ADMIN_DEFAULT';

/**
 * retrieve all needed agency data
 * @return {Promise}
 */
export const putAgenciesForAdmin = (adminId: string, agencyIds: string[]) => {
    const agencies = agencyIds.map((agencyId) => ({
        agencyId,
        role: DEFAULT_ROLE,
    }));

    return fetchData({
        url: `${adminEndpoint}/${adminId}/agencies`,
        method: FETCH_METHODS.PUT,
        skipAuth: false,
        responseHandling: [FETCH_ERRORS.CATCH_ALL],
        bodyData: JSON.stringify(agencies),
    });
};

import { FETCH_ERRORS, FETCH_METHODS, fetchData } from '../fetchData';
import { adminEndpoint } from '../../appConfig';

/**
 * delete admin
 * @param id
 * @return data
 */
export const deleteAdminData = (id: string) => {
    return fetchData({
        url: `${adminEndpoint}/${id}`,
        method: FETCH_METHODS.DELETE,
        skipAuth: false,
        responseHandling: [FETCH_ERRORS.CATCH_ALL],
    });
};

import { usersConsultantsSearchEndpoint } from '../../appConfig';

import { FETCH_METHODS, fetchData } from '../fetchData';
import removeEmbedded from '../../utils/removeEmbedded';

export const DEFAULT_SORT = 'FIRSTNAME';
export const DEFAULT_ORDER = 'ASC';

/**
 * retrieve all needed counselor data
 * @return {Promise}
 */
const getCounselorSearchData = (state: TableState, query: string) => {
    const sortBy = state?.sortBy || DEFAULT_SORT;
    const order = state?.order || DEFAULT_ORDER;

    const searchQuery = query.length <= 0 ? '*' : query;

    return fetchData({
        url: `${usersConsultantsSearchEndpoint}?query=${encodeURIComponent(searchQuery)}&page=${
            state?.current || 1
        }&perPage=${state?.pageSize || 10}&order=${order}&field=${sortBy}`,
        method: FETCH_METHODS.GET,
        skipAuth: false,
        responseHandling: [],
    }).then((result) => {
        return removeEmbedded(result);
    });
};

export default getCounselorSearchData;

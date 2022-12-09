import { FETCH_ERRORS, FETCH_METHODS, fetchData } from '../fetchData';
import { counselorEndpoint } from '../../appConfig';

/**
 * delete counselor
 * @param counselorData
 * @return data
 */
export const deleteCounselorData = (counselorDataId: string) => {
    const counselor = fetchData({
        url: `${counselorEndpoint}/${counselorDataId}`,
        method: FETCH_METHODS.DELETE,
        skipAuth: false,
        responseHandling: [FETCH_ERRORS.CATCH_ALL],
    });

    return counselor;
};

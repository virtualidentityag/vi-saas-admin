import { QueryOptions, useQuery } from 'react-query';
import { fetchData, FETCH_METHODS } from '../api/fetchData';
import { usersConsultantsSearchEndpoint } from '../appConfig';
import { CounselorData } from '../types/counselor';
import { HalResponseList, ResponseList } from '../types/ResponseList';
import removeEmbedded from '../utils/removeEmbedded';

interface ConsultantsDataProps extends QueryOptions<ResponseList<CounselorData>> {
    search?: string;
    current?: number;
    sortBy?: string;
    order?: string;
    pageSize?: number;
}

const DEFAULT_SORT = 'FIRSTNAME';
const DEFAULT_ORDER = 'ASC';

export const useConsultantsData = ({
    search,
    current,
    sortBy,
    order,
    pageSize,
    ...options
}: ConsultantsDataProps = {}) => {
    return useQuery(
        ['CONSULTANTS', search, current, sortBy, order, pageSize],
        () => {
            return fetchData({
                url: `${usersConsultantsSearchEndpoint}?query=${encodeURIComponent(search || '*')}&page=${
                    current || 1
                }&perPage=${pageSize || 15}&order=${order || DEFAULT_ORDER}&field=${sortBy || DEFAULT_SORT}`,
                method: FETCH_METHODS.GET,
                skipAuth: false,
                responseHandling: [],
            }).then((result: HalResponseList<CounselorData>) => removeEmbedded(result) as ResponseList<CounselorData>);
        },
        options,
    );
};

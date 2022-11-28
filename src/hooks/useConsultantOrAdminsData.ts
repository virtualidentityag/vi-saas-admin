import { QueryOptions, useQuery, UseQueryOptions } from 'react-query';
import { fetchData, FETCH_METHODS } from '../api/fetchData';
import { adminsSearchEndpoint, usersConsultantsSearchEndpoint } from '../appConfig';
import { CounselorData } from '../types/counselor';
import { HalResponseList, ResponseList } from '../types/ResponseList';
import removeEmbedded from '../utils/removeEmbedded';

interface ConsultantsDataProps extends UseQueryOptions<ResponseList<CounselorData>> {
    search?: string;
    current?: number;
    sortBy?: string;
    order?: string;
    pageSize?: number;
    typeOfUser: 'consultants' | 'admins';
}

const DEFAULT_SORT = 'FIRSTNAME';
const DEFAULT_ORDER = 'ASC';

export const useConsultantOrAdminsData = (
    { search, current, sortBy, order, pageSize, typeOfUser, ...options }: ConsultantsDataProps = {
        typeOfUser: 'consultants',
    },
) => {
    const baseUrl = typeOfUser === 'consultants' ? usersConsultantsSearchEndpoint : adminsSearchEndpoint;
    return useQuery(
        [typeOfUser.toUpperCase(), search, current, sortBy, order, pageSize],
        () => {
            return fetchData({
                url: `${baseUrl}?query=${encodeURIComponent(search || '*')}&page=${current || 1}&perPage=${
                    pageSize || 15
                }&order=${order || DEFAULT_ORDER}&field=${sortBy || DEFAULT_SORT}`,
                method: FETCH_METHODS.GET,
                skipAuth: false,
                responseHandling: [],
            }).then((result: HalResponseList<CounselorData>) => removeEmbedded(result) as ResponseList<CounselorData>);
        },
        options as QueryOptions<ResponseList<CounselorData>>,
    );
};

import { useQuery, UseQueryOptions } from 'react-query';
import { fetchData, FETCH_ERRORS, FETCH_METHODS } from '../api/fetchData';
import { tenantAdminEndpoint } from '../appConfig';
import { HalResponse, ResponseList } from '../types/ResponseList';
import { SimpleTenant } from '../types/SimpleTenant';
import removeEmbedded from '../utils/removeEmbedded';

interface TenantsProps extends UseQueryOptions<ResponseList<SimpleTenant>> {
    search?: string;
    perPage?: number;
    page?: number;
    sort?: string;
    dir?: string;
}

export const useTenantsData = ({
    page,
    search,
    perPage = 20,
    sort = 'NAME',
    dir = 'ASC',
    ...options
}: TenantsProps) => {
    return useQuery<ResponseList<SimpleTenant>>(
        ['TENANTS', page, perPage, search, sort, dir],
        () => {
            return fetchData({
                url: `${tenantAdminEndpoint}/search?page=${page || 1}&perPage=${perPage}&query=${
                    search || ''
                }&field=${sort}&order=${dir}`,
                method: FETCH_METHODS.GET,
                skipAuth: false,
                responseHandling: [FETCH_ERRORS.CATCH_ALL],
            }).then((v: HalResponse<SimpleTenant>) => removeEmbedded(v) as ResponseList<SimpleTenant>);
        },
        options,
    );
};

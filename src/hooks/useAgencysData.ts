import { QueryOptions, useQuery } from 'react-query';
import getAgencyData from '../api/agency/getAgencyData';
import { AgencyData } from '../types/agency';
import { ResponseList } from '../types/ResponseList';

interface AgenciesDataProps extends QueryOptions<ResponseList<AgencyData>> {
    current?: number;
    sortBy?: string;
    order?: string;
    pageSize?: number;
}

export const useAgenciesData = ({ current, sortBy, order, pageSize, ...options }: AgenciesDataProps) => {
    return useQuery(
        ['AGENCIES', current, sortBy, order, pageSize],
        () => getAgencyData({ current, sortBy, order, pageSize }),
        options,
    );
};

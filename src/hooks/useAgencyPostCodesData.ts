import { useQuery } from 'react-query';
import getAgencyPostCodeRange from '../api/agency/getAgencyPostCodeRange';

export const useAgencyPostCodesData = (id: string) => {
    return useQuery(['AGENCY_POST_CODES', id], () => getAgencyPostCodeRange(id));
};

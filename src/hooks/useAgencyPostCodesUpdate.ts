import { useMutation, useQueryClient } from 'react-query';
import updateAgencyPostCodeRange from '../api/agency/updateAgencyPostCodeRange';

export const useAgencyPostCodesUpdate = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation(
        (data: { postcodeRanges: string }) => {
            return updateAgencyPostCodeRange(id, [], '');
        },
        {
            onSuccess: () => {
                queryClient.removeQueries(['AGENCY_POST_CODES']);
            },
        },
    );
};

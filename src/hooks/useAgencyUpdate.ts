import { useMutation, useQueryClient } from 'react-query';
import { updateAgencyData } from '../api/agency/updateAgencyData';
import { AgencyData } from '../types/agency';
import { useAgencyData } from './useAgencyData';

export const useAgencyUpdate = (id: string) => {
    const queryClient = useQueryClient();
    const { data: agencyData } = useAgencyData({ id, enabled: id !== 'add' });

    return useMutation(
        (data: Partial<AgencyData>) => {
            return updateAgencyData(agencyData, { ...agencyData, ...data });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['AGENCY', 'AGENCIES']);
            },
        },
    );
};

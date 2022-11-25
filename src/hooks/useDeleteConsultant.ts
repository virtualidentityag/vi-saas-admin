import { useMutation, UseMutationOptions } from 'react-query';
import { deleteCounselorData } from '../api/counselor/deleteCounselorData';

export const useDeleteConsultant = (options: UseMutationOptions<void, Error, string>) => {
    return useMutation<void, Error, string>((id) => deleteCounselorData(id), options);
};

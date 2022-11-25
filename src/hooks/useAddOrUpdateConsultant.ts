import { useMutation, UseMutationOptions } from 'react-query';
import { addCounselorData } from '../api/counselor/addCounselorData';
import { editCounselorData } from '../api/counselor/editCounselorData';
import { CounselorData } from '../types/counselor';

interface AddOrUpdateConsultantOptions extends UseMutationOptions<CounselorData, Error, CounselorData> {
    id?: string;
}
export const useAddOrUpdateConsultant = ({ id, ...options }: AddOrUpdateConsultantOptions) => {
    return useMutation((formData) => {
        return id ? editCounselorData(id, formData) : addCounselorData(formData);
    }, options);
};

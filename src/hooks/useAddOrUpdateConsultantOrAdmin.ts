import { useMutation, UseMutationOptions } from 'react-query';
import { addAdminData } from '../api/admins/addAdminData';
import { editAdminData } from '../api/admins/editAdminData';
import { addCounselorData } from '../api/counselor/addCounselorData';
import { editCounselorData } from '../api/counselor/editCounselorData';
import { AdminData } from '../types/admin';
import { CounselorData } from '../types/counselor';

interface AddOrUpdateConsultantOptions
    extends UseMutationOptions<CounselorData | AdminData, Error, CounselorData | AdminData> {
    id?: string;
    typeOfUser: 'consultants' | 'admins';
}
export const useAddOrUpdateConsultantOrAdmin = ({ id, typeOfUser, ...options }: AddOrUpdateConsultantOptions) => {
    return useMutation((formData) => {
        if (typeOfUser === 'consultants') {
            return id ? editCounselorData(id, formData as CounselorData) : addCounselorData(formData);
        }
        return id ? editAdminData(id, formData as AdminData) : addAdminData(formData as AdminData);
    }, options);
};

import { useMutation, UseMutationOptions } from 'react-query';
import { deleteAdminData } from '../api/admins/deleteAdminData';
import { deleteCounselorData } from '../api/counselor/deleteCounselorData';

interface DeleteConsultantOrAdminProps extends UseMutationOptions<void, Error, string> {
    typeOfUser: 'consultants' | 'admins';
}
export const useDeleteConsultantOrAdmin = ({ typeOfUser, ...options }: DeleteConsultantOrAdminProps) => {
    return useMutation<void, Error, string>((id) => {
        return typeOfUser === 'consultants' ? deleteCounselorData(id) : deleteAdminData(id);
    }, options);
};

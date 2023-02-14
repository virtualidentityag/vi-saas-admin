import { useMutation, UseMutationOptions } from 'react-query';
import { deleteAgencyAdminData } from '../api/admins/deleteAgencyAdminData';
import { deleteCounselorData } from '../api/counselor/deleteCounselorData';

interface DeleteConsultantOrAdminProps extends UseMutationOptions<void, Error, string> {
    typeOfUser: 'consultants' | 'admins';
}
export const useDeleteConsultantOrAgencyAdmin = ({ typeOfUser, ...options }: DeleteConsultantOrAdminProps) => {
    return useMutation<void, Error, string>((id) => {
        return typeOfUser === 'consultants' ? deleteCounselorData(id) : deleteAgencyAdminData(id);
    }, options);
};

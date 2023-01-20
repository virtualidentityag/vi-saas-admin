import { useMutation, UseMutationOptions } from 'react-query';
import { fetchData, FETCH_ERRORS, FETCH_METHODS, FETCH_SUCCESS } from '../api/fetchData';
import { mainURL } from '../appConfig';

export const useUpdateUserPassword = (
    options?: UseMutationOptions<void, Error, { oldPassword: string; newPassword: string }, Error | Response>,
) => {
    return useMutation((formData) => {
        const bodyData = JSON.stringify({
            ...formData,
        });

        return fetchData({
            url: `${mainURL}/service/users/password/change`,
            method: FETCH_METHODS.PUT,
            responseHandling: [FETCH_SUCCESS.CONTENT, FETCH_ERRORS.CONFLICT_WITH_RESPONSE],
            bodyData,
        });
    }, options);
};

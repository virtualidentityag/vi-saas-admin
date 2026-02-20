import { useMutation, useQueryClient } from 'react-query';
import {
    apiDeleteTwoFactorAuth,
    apiPostTwoFactorAuthEmailWithCode,
    apiPutTwoFactorAuthApp,
    apiPutTwoFactorAuthEmail,
} from '../api/user/apiTwoFactorAuth';
import { TwoFactorType } from '../enums/TwoFactorType';
import { UserData } from '../types/user';
import { USER_DATA_KEY } from './useUserData.hook';

interface UserMutationData {
    twoFactorType: TwoFactorType;
    otp: string;
    secret?: string;
}

export const useUserTwoFactorAuth = () => {
    const queryClient = useQueryClient();

    return useMutation<unknown, Error, UserMutationData>(
        ({ twoFactorType, otp, secret }: UserMutationData) => {
            switch (twoFactorType) {
                case TwoFactorType.App:
                    return apiPutTwoFactorAuthApp({ secret, otp });
                case TwoFactorType.Email:
                    return apiPostTwoFactorAuthEmailWithCode(otp);
                default:
                    return Promise.resolve();
            }
        },
        {
            onSuccess: (_, { twoFactorType }) => {
                queryClient.setQueryData<UserData>(USER_DATA_KEY, (prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        twoFactorAuth: { ...prev.twoFactorAuth, isActive: true, type: twoFactorType },
                    };
                });
            },
        },
    );
};

export const useUserTwoFactorDelete = () => {
    const queryClient = useQueryClient();

    return useMutation(() => apiDeleteTwoFactorAuth(), {
        onSuccess: () => {
            queryClient.setQueryData<UserData>(USER_DATA_KEY, (prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    twoFactorAuth: { ...prev.twoFactorAuth, isActive: false },
                };
            });
        },
    });
};

export const useUserTwoFactorSendEmailCode = () => {
    const queryClient = useQueryClient();

    return useMutation<unknown, Error, string>((email: string) => apiPutTwoFactorAuthEmail(email), {
        onSuccess: (_, email) => {
            queryClient.setQueryData<UserData>(USER_DATA_KEY, (prev) => {
                if (!prev) return prev;
                return { ...prev, email };
            });
        },
    });
};

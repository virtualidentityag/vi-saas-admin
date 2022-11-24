import { useMutation } from 'react-query';
import { setTokens } from '../api/auth/auth';
import getAccessToken from '../api/auth/getAccessToken';
import { FETCH_ERRORS } from '../api/fetchData';
import { useAppConfigContext } from '../context/useAppConfig';
import { TwoFactorType } from '../enums/TwoFactorType';
import { LoginData } from '../types/loginData';
import parseJwt from '../utils/parseJWT';

interface LoginParams {
    username: string;
    password: string;
    otp: string;
}

interface ErrorLogin {
    message: string;
    options: {
        data: { otpType: TwoFactorType };
    };
}

export const useLoginMutation = (tenantId: string) => {
    const { settings } = useAppConfigContext();
    return useMutation<LoginData, ErrorLogin, LoginParams>(
        ['login', 'user-data', tenantId],
        async ({ username, password, otp }: any) => {
            return getAccessToken({ username, password, otp }).then((data) => {
                if (settings?.multitenancyWithSingleDomainEnabled) {
                    return data;
                }

                const { tenantId: userTenantId } = parseJwt(data.access_token);
                return userTenantId === tenantId ? data : Promise.reject(new Error(FETCH_ERRORS.UNAUTHORIZED));
            });
        },
        {
            onSuccess: (data) => {
                setTokens(data.access_token, data.expires_in, data.refresh_token, data.refresh_expires_in);
            },
        },
    );
};

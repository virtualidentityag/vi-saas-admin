import logout from './logout';
import { setValueInCookie } from './accessSessionCookie';
import { getTokenExpiryFromLocalStorage, setTokenExpiryInLocalStorage } from './accessSessionLocalStorage';
import refreshKeycloakAccessToken from './refreshKeycloakAccessToken';
import routePathNames from '../../appConfig';

export const RENEW_BEFORE_EXPIRY_IN_MS = 10 * 1000; // seconds

export const setTokens = (
    access_token: string | undefined,
    expires_in: number | undefined,
    refresh_token: string | undefined,
    refresh_expires_in: number | undefined,
) => {
    if (access_token) {
        setValueInCookie('keycloak', access_token);
        setTokenExpiryInLocalStorage('auth.access_token_valid_until', expires_in);
    }
    if (refresh_token) {
        setValueInCookie('refreshToken', refresh_token);
        setTokenExpiryInLocalStorage('auth.refresh_token_valid_until', refresh_expires_in);
    }
};

const refreshTokens = (): Promise<void> => {
    const currentTime = new Date().getTime();
    const tokenExpiry = getTokenExpiryFromLocalStorage();

    if (tokenExpiry.refreshTokenValidUntilTime <= currentTime - RENEW_BEFORE_EXPIRY_IN_MS) {
        logout(true, routePathNames.login);
        return Promise.resolve();
    }

    return refreshKeycloakAccessToken().then((response) => {
        setTokens(response.access_token, response.expires_in, response.refresh_token, response.refresh_expires_in);
    });
};

const startTimers = ({
    accessTokenValidInMs,
    refreshTokenValidInMs,
}: {
    accessTokenValidInMs: number;
    refreshTokenValidInMs: number;
}) => {
    const accessTokenRefreshIntervalInMs = accessTokenValidInMs - RENEW_BEFORE_EXPIRY_IN_MS;

    let refreshInterval: number | undefined;
    // just a sanity check so that we don't accidentally register an endless loop
    if (accessTokenRefreshIntervalInMs > 0) {
        refreshInterval = window.setInterval(() => {
            refreshTokens();
        }, accessTokenRefreshIntervalInMs);
    }

    if (refreshTokenValidInMs > accessTokenValidInMs) {
        // when refresh token is longer valid than access token we need to
        // logout if the refresh token expires
        window.setTimeout(() => {
            if (refreshInterval) {
                window.clearInterval(refreshInterval);
            }

            logout(true, routePathNames.login);
        }, refreshTokenValidInMs);
    }
};

export const handleTokenRefresh = (): Promise<void> => {
    return new Promise((resolve) => {
        const currentTime = new Date().getTime();
        const tokenExpiry = getTokenExpiryFromLocalStorage();
        const accessTokenValidInMs = tokenExpiry.accessTokenValidUntilTime - currentTime;

        const refreshTokenValidInMs = tokenExpiry.refreshTokenValidUntilTime - currentTime;

        if (refreshTokenValidInMs <= 0 && accessTokenValidInMs <= 0) {
            // access token and refresh token no longer valid, logout
            logout(true, routePathNames.login);
            resolve();
        } else if (accessTokenValidInMs <= 0) {
            // access token no longer valid but refresh token still valid, refresh tokens
            refreshTokens().then(() => {
                startTimers({
                    accessTokenValidInMs,
                    refreshTokenValidInMs,
                });
                resolve();
            });
        } else {
            // access token and refresh token still valid, just start the timers
            startTimers({
                accessTokenValidInMs,
                refreshTokenValidInMs,
            });
            resolve();
        }
    });
};

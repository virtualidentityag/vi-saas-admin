import { removeAllCookies } from './accessSessionCookie';
import apiKeycloakLogout from './apiLogoutKeycloak';
import { removeTokenExpiryFromLocalStorage } from './accessSessionLocalStorage';
import routePathNames from '../../appConfig';

let isRequestInProgress = false;

const redirectAfterLogout = (altRedirectUrl?: string) => {
    const redirectUrl = altRedirectUrl || routePathNames.login;
    setTimeout(() => {
        window.location.href = redirectUrl;
    }, 100);
};

const invalidateCookies = (withRedirect = true, redirectUrl?: string) => {
    removeAllCookies();
    removeTokenExpiryFromLocalStorage();
    if (withRedirect) {
        redirectAfterLogout(redirectUrl);
    }
};

const logout = (withRedirect = true, redirectUrl?: string): void => {
    if (isRequestInProgress) {
        return;
    }
    isRequestInProgress = true;
    const clearUserData = () => {
        // remove storages
        localStorage.clear();
        sessionStorage.clear();
    };

    apiKeycloakLogout()
        .then(() => {
            clearUserData();
            invalidateCookies(withRedirect, redirectUrl);
        })
        .catch(() => {
            clearUserData();
            invalidateCookies(withRedirect, redirectUrl);
        })
        .finally(() => {
            isRequestInProgress = false;
        });
};

export default logout;

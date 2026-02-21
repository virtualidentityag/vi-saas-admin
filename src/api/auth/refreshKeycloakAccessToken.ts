import { getValueFromCookie } from './accessSessionCookie';
import { loginEndpoint } from '../../appConfig';
import { LoginData } from '../../types/loginData';

const refreshKeycloakAccessToken = (): Promise<LoginData> =>
    new Promise((resolve, reject) => {
        const refreshToken = getValueFromCookie('refreshToken');
        const data = `refresh_token=${refreshToken}&client_id=app&grant_type=refresh_token`;

        const req = new Request(loginEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'cache-control': 'no-cache',
            },
            body: data,
        });

        fetch(req)
            .then(async (response) => {
                if (response.status === 200) {
                    const dataResponse = await response.json();
                    resolve(dataResponse);
                } else if (response.status === 401) {
                    reject(new Error('keycloakLogin'));
                }
            })
            .catch((error) => {
                console.error('Token refresh failed:', error);
                reject(new Error('keycloakLogin'));
            });
    });

export default refreshKeycloakAccessToken;

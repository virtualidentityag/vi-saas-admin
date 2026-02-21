import { getValueFromCookie, setValueInCookie } from '../api/auth/accessSessionCookie';

const generateCsrfToken = (refreshToken = false) => {
    const currentToken = getValueFromCookie('CSRF-TOKEN');
    // only refresh if necessary to avoid errors on async functionality
    if (!currentToken || refreshToken) {
        const array = new Uint8Array(24);
        crypto.getRandomValues(array);
        const token = Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');

        setValueInCookie('CSRF-TOKEN', token);
        return token;
    }
    return currentToken;
};

export default generateCsrfToken;

export function createCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = `${name}=${value}${expires}; path=/`;
}

export const readCookie = (name) => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    console.log(ca);
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

export function eraseCookie(name) {
    createCookie(name, '', -1);
}

export function setAppToken(token) {
    createCookie('token', token, 1);
}

export const getAppToken = () => {
    return readCookie('token');
}

export function redirectToLogin() {
    eraseCookie('token');
    window.location.href = '/';
}

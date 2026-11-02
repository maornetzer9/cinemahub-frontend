export const SESSION_TIMEOUT_LOGOUT_KEY = 'sessionTimeoutLogout';
export const MANUAL_LOGOUT_KEY = 'manualLogout';

let sessionTimeoutCancelled = false;

export const cancelSessionTimeout = () => {
    sessionTimeoutCancelled = true;
};

export const resetSessionTimeoutCancel = () => {
    sessionTimeoutCancelled = false;
};

export const isSessionTimeoutCancelled = () => sessionTimeoutCancelled;

export const markManualLogout = () => {
    cancelSessionTimeout();
    sessionStorage.setItem(MANUAL_LOGOUT_KEY, '1');
};

export const clearLogoutFlags = () => {
    resetSessionTimeoutCancel();
    sessionStorage.removeItem(MANUAL_LOGOUT_KEY);
    sessionStorage.removeItem(SESSION_TIMEOUT_LOGOUT_KEY);
};

export const isManualLogout = () => sessionStorage.getItem(MANUAL_LOGOUT_KEY) === '1';

export const readStoredJson = (key, fallback) => {
    try {
        const raw = localStorage.getItem(key);
        if (raw == null || raw === '') return fallback;
        return JSON.parse(raw);
    } catch {
        return fallback;
    }
};

export const readStoredToken = () => {
    const value = readStoredJson('token', null);
    return typeof value === 'string' && value.trim() ? value : null;
};

export const readStoredUsername = () => {
    const value = readStoredJson('username', '');
    return typeof value === 'string' ? value : '';
};

export const readStoredBoolean = (key) => readStoredJson(key, false) === true;

export const hasAuthToken = () => Boolean(readStoredToken());

export const getRemainingSessionMinutes = () => {
    try {
        const exp = parseInt(localStorage.getItem('sessionExpirationTime') || '0', 10);
        if (Number.isFinite(exp) && exp > Date.now()) {
            return Math.max(0, Math.floor((exp - Date.now()) / 60000));
        }

        const remaining = Number(JSON.parse(localStorage.getItem('sessionTimeoutRemaining') || '0'));
        if (Number.isFinite(remaining) && remaining > 0) {
            return Math.floor(remaining);
        }

        const initial = Number(JSON.parse(localStorage.getItem('sessionTimeout') || '0'));
        if (Number.isFinite(initial) && initial > 0) {
            return Math.floor(initial);
        }

        return 0;
    } catch {
        return 0;
    }
};

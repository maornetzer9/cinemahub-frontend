import axios from 'axios';
import { store } from '../reducers/store';
import { RESET_APP_STATE } from '../actions/app';
import { SESSION_TIMEOUT_LOGOUT_KEY, isManualLogout } from './sessionLogout';
const handleAuthFailure = () => {
    localStorage.clear();
    store.dispatch({ type: RESET_APP_STATE });
    if (window.location.pathname !== '/') {
        window.location.assign('/');
    }
};

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        if (status === 401) {
            if (sessionStorage.getItem(SESSION_TIMEOUT_LOGOUT_KEY) || isManualLogout()) {
                return Promise.reject(error);
            }
            handleAuthFailure();
        }
        return Promise.reject(error);
    }
);

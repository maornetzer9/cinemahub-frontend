import { loginRoute, registerRoute, addNewUserRoute, loadingUsersRoute, deleteUserRoute, editUserRoute, disconnectUserRoute } from "../routes/users";
import { resetAppState } from "./app";
import { clearLogoutFlags } from "../utils/sessionLogout";

export const LOADING_USERS_LOADING = 'LOADING_USERS_LOADING';
export const LOADING_USERS_SUCCESS = 'LOADING_USERS_SUCCESS';
export const LOADING_USERS_FAILURE = 'LOADING_USERS_FAILURE';

export const LOGIN_USER_LOADING = 'LOGIN_USER_LOADING';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE';

export const REGISTER_USER_LOADING = 'REGISTER_USER_LOADING';
export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
export const REGISTER_USER_FAILURE = 'REGISTER_USER_FAILURE';

export const ADD_NEW_USER_LOADING = 'ADD_NEW_USER_LOADING';
export const ADD_NEW_USER_SUCCESS = 'ADD_NEW_USER_SUCCESS';
export const ADD_NEW_USER_FAILURE = 'ADD_NEW_USER_FAILURE';

export const EDIT_USER_LOADING = 'EDIT_USER_LOADING';
export const EDIT_USER_SUCCESS = 'EDIT_USER_SUCCESS';
export const EDIT_USER_FAILURE = 'EDIT_USER_FAILURE';

export const DELETE_USER_LOADING = 'DELETE_USER_LOADING';
export const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS';
export const DELETE_USER_FAILURE = 'DELETE_USER_FAILURE';

export const DISCONNECT_USER_SUCCESS = 'DISCONNECT_USER_SUCCESS';
export const DISCONNECT_USER_FAILURE = 'DISCONNECT_USER_FAILURE';


export const loadingUsersAction = (url) => async ( dispatch ) => {
    try
    {
        dispatch({ type: LOADING_USERS_LOADING })
        const { code, message, users } = await loadingUsersRoute(url);

        if(code !== 200)
        {
            dispatch({type: LOADING_USERS_FAILURE, payload: message});
            return { code, message };
        } 

        dispatch({type: LOADING_USERS_SUCCESS, payload: users })
        return { code, message, users };
    }
    catch(err)
    {
        dispatch({type: LOADING_USERS_FAILURE, payload: err.message});
        return { code: 500, message: err.message };
    }
};


export const LoginAction = (username, password, url) => async ( dispatch ) => {
    try
    {
        dispatch({ type: LOGIN_USER_LOADING })
        const { code, message, user, token, mustChangePassword } = await loginRoute(username, password, url);

        if(code !== 200)
        {
            dispatch({type: LOGIN_USER_FAILURE, payload: message});
            return { code, message };
        } 

        localStorage.removeItem('sessionTimeoutRemaining');
        localStorage.removeItem('sessionExpirationTime');
        clearLogoutFlags();

        localStorage.setItem('token', JSON.stringify(token));
        localStorage.setItem('username', JSON.stringify(user.username));
        localStorage.setItem('mustChangePassword', JSON.stringify(Boolean(mustChangePassword)));

        const sessionMinutes = Number(user.sessionTimeout);
        if (Number.isFinite(sessionMinutes) && sessionMinutes > 0) {
            localStorage.setItem('sessionTimeout', JSON.stringify(sessionMinutes));
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.exp) {
                    localStorage.setItem('sessionExpirationTime', String(payload.exp * 1000));
                }
            } catch {
                // fall back to SessionTimeout mount scheduling
            }
        } else {
            localStorage.removeItem('sessionTimeout');
        }

        dispatch(resetAppState());
        dispatch({type: LOGIN_USER_SUCCESS, payload: user})
        return { code, message, mustChangePassword: Boolean(mustChangePassword) };
    }
    catch(err)
    {
        // Always return a controlled shape — callers destructure { code, message } from this.
        // Without a return, network errors / 5xx / rate-limit throws leave the caller with
        // `undefined`, producing "Cannot destructure property 'code' of '(intermediate value)'".
        const message = (err && err.message) || 'Login request failed';
        console.error(message);
        dispatch({type: LOGIN_USER_FAILURE, payload: message});
        return { code: 500, message };
    }
};


export const registerAction = (form, url) => async (dispatch) => {
    try
    {
        dispatch({ type: REGISTER_USER_LOADING });
        const { code, message } = await registerRoute(form, url);

        if (code !== 200)
        {
            dispatch({ type: REGISTER_USER_FAILURE, payload: message });
            return { code, message };
        }

        dispatch({ type: REGISTER_USER_SUCCESS });
        return { code, message };
    }
    catch (err)
    {
        console.error(err.message);
        const text = (err && err.message) || "Register request failed";
        dispatch({ type: REGISTER_USER_FAILURE, payload: text });
        return { code: 500, message: text };
    }
};


export const addNewUserAction = (form, url) => async ( dispatch ) => {
    try
    {
        dispatch({type: ADD_NEW_USER_LOADING });
        const { code, message, user } = await addNewUserRoute(form, url);

        if(code !== 200)
        {
            dispatch({type: ADD_NEW_USER_FAILURE, payload: message});
            return { code, message };
        } 

        dispatch({type: ADD_NEW_USER_SUCCESS, payload: user})
        return { code, message };
    }
    catch(err)
    {
        console.error(err.message);
        const text = (err && err.message) || "Add user request failed";
        dispatch({type: ADD_NEW_USER_FAILURE, payload: text});
        return { code: 500, message: text };
    }
};


export const editUserAction = (form, url) => async ( dispatch ) => {
    try
    {
        dispatch({type: EDIT_USER_LOADING });
        const { code, message, users, user } = await editUserRoute(form, url);

        if(code !== 200)
        {
            dispatch({type: EDIT_USER_FAILURE, payload: message});
            return { code, message };
        } 

        dispatch({type: EDIT_USER_SUCCESS, payload: { users, user }})
        return { code, message };
    }
    catch(err)
    {
        console.error(err.message);
        dispatch({type: EDIT_USER_FAILURE, payload: err.message});
    }
};


export const deleteUserAction = (_id, url) => async ( dispatch ) => {
    try
    {
        dispatch({type: DELETE_USER_LOADING });
        const { code, message, users } = await deleteUserRoute(_id, url);

        if(code !== 200)
        {
            dispatch({type: DELETE_USER_FAILURE, payload: message});
            return { code, message };
        } 

        dispatch({type: DELETE_USER_SUCCESS, payload: users})
        return { code, message };
    }
    catch(err)
    {
        console.error(err.message);
        dispatch({type: DELETE_USER_FAILURE, payload: err.message});
    }
};

export const disconnectUserAction = (user, url) => async ( dispatch ) => {
    try
    {
        const { code, message, user: updatedUser } = await disconnectUserRoute(user, url);

        if(code !== 200)
        {
            dispatch({type: DISCONNECT_USER_FAILURE, payload: message});
            return { code, message };
        }

        dispatch({type: DISCONNECT_USER_SUCCESS, payload: updatedUser})
        return { code, message, user: updatedUser };
    }
    catch(err)
    {
        console.error(err.message);
        dispatch({type: DISCONNECT_USER_FAILURE, payload: err.message});
        return { code: 500, message: err.message };
    }
};

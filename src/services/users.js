import { CINEMA } from "../config/serviceUrls";
import { addNewUserAction, deleteUserAction, disconnectUserAction, editUserAction, loadingUsersAction, LoginAction, registerAction } from "../actions/users";
import { changePasswordAfterFirstLoginRoute } from "../routes/users";

export const loginService = async (username, password, dispatch) => {

    try
    {
        const LOGIN_PATH = `${CINEMA}/users/login`;
        const { code, message, mustChangePassword } = await dispatch( LoginAction(username, password, LOGIN_PATH) );
        return { code, message, mustChangePassword };
    }
    catch(err)
    {
        console.error(err.message);
        throw new Error(err.message);
    }
};

export const registerService = async (form, dispatch) => {
    try
    {
        const REGISTER_PATH = `${CINEMA}/users/register`;
        const { code, message } = await dispatch(registerAction(form, REGISTER_PATH));
        return { code, message };
    }
    catch(err)
    {
        console.error(err.message);
        throw new Error(err.message);
    }
};

export const changePasswordAfterFirstLoginService = async (newPassword) => {
    try
    {
        const CHANGE_PASSWORD_PATH = `${CINEMA}/users/change-password`;
        const { code, message, token } = await changePasswordAfterFirstLoginRoute(newPassword, CHANGE_PASSWORD_PATH);
        return { code, message, token };
    }
    catch(err)
    {
        console.error(err.message);
        throw new Error(err.message);
    }
};


export const loadingUsers = async (dispatch) => {
    try 
    {
        const LOADING_USERS = `${CINEMA}/users/`;
        await dispatch(loadingUsersAction(LOADING_USERS));
    } 
    catch(err) 
    {
        console.error(err.message);
        throw new Error(err.message);
    }
};


export const addNewUserService = async (form, dispatch) => {
    try
    {
        const ADD_NEW_USER = `${CINEMA}/users/add`;
        const { code, message } = await dispatch(addNewUserAction( form, ADD_NEW_USER ));
        return { code, message }
    }
    catch(err)
    {
        console.error(err.message);
        throw new Error(err.message);
    }
}


export const deleteUserById = async (_id, dispatch) => {
    if (!_id) throw new Error('Id cannot be provided');
    try 
    {
        const DELETE_USER = `${CINEMA}/users/delete`;
        await dispatch(deleteUserAction(_id, DELETE_USER));
    } 
    catch(err) 
    {
        console.error(err.message);
        throw new Error(err.message);
    }
};


export const editUserService = async ( form, dispatch ) => {
    try
    {
        const EDIT_USER = `${CINEMA}/users/edit`
        const { code, message } = await dispatch(editUserAction(form, EDIT_USER));
        return { code, message }
    }
    catch(err)
    {
        console.error(err.message);
        throw new Error(err.message);
    }
};


export const disconnectUserService = async (user, dispatch) => {
    try
    {
        const DISCONNECT_PATH = `${CINEMA}/users/disconnect`;
        const result = await dispatch(disconnectUserAction(user, DISCONNECT_PATH));
        return result ?? { code: 500, message: 'Disconnect failed' };
    }
    catch(err)
    {
        console.error(err.message);
        return { code: 500, message: err.message };
    }
}

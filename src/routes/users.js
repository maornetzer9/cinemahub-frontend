import axios from 'axios';
import { readStoredToken } from '../utils/sessionLogout';

const authHeader = () => ({
    headers: { Authorization: `Bearer ${readStoredToken() ?? ''}` }
});

export const loginRoute = async (username, password, url) => {
    try
    {
        const { data } = await axios.post(url, { username, password });
        return data
    }
    catch(err)
    {
        console.error(err.message);
        throw new Error('Failed to login user', err.message);
    }
};

export const registerRoute = async (form, url) => {
    try
    {
        const { data } = await axios.post(url, form);
        return data;
    }
    catch(err)
    {
        console.error(err.message);
        const body = err.response && err.response.data;
        const msg = body && typeof body.message === "string" ? body.message : err.message;
        throw new Error(msg || "Failed to register user");
    }
};


export const changePasswordAfterFirstLoginRoute = async (newPassword, url) => {
    try
    {
        const { data } = await axios.put(url, { newPassword }, authHeader());
        return data;
    }
    catch(err)
    {
        console.error(err.message);
        const body = err.response && err.response.data;
        const msg = body && typeof body.message === "string" ? body.message : err.message;
        throw new Error(msg || 'Failed to change password');
    }
};


export const loadingUsersRoute = async (url) => {
    try
    {
        const { data } = await axios.get(url, authHeader());
        return data
    }
    catch(err)
    {
        const body = err.response?.data;
        if (body && typeof body.code !== 'undefined') {
            return body;
        }
        const msg = body && typeof body.message === 'string' ? body.message : err.message;
        throw new Error(msg || 'Failed to loading users');
    }
};


export const addNewUserRoute = async (form, url) => {
    try {
        const { data } = await axios.post(url, form, authHeader());
        return data;
    } catch (err) {
        console.error(err.message);
        const body = err.response && err.response.data;
        let msg =
            typeof body === "string"
                ? body
                : body && typeof body.message === "string"
                  ? body.message
                  : err.message;
        throw new Error(msg || "Failed to add new user");
    }
};


export const editUserRoute = async (form, url) => {
    try
    {
        const { data } = await axios.put(url, form, authHeader());
        return data
    }
    catch(err)
    {
        console.error(err.message);
        throw new Error('Failed to edit user', err.message);
    }
};


export const deleteUserRoute = async (_id, url) => {
    try
    {
        const queriesUrl = `${url}?_id=${_id}`;
        const { data } = await axios.delete(queriesUrl, authHeader());
        return data
    }
    catch(err)
    {
        console.error(err.message);
        throw new Error('Failed to delete user', err.message);
    }
};


export const disconnectUserRoute = async (user, url) => {
    try
    {
        const { data } = await axios.put(url, { user }, authHeader());
        return data
    }
    catch(err)
    {
        console.error(err.message);
        throw new Error('Failed to disconnect user', err.message);
    }
};

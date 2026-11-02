import axios from 'axios';
import { readStoredToken } from '../utils/sessionLogout';

const authHeader = () => ({
    headers: { Authorization: `Bearer ${readStoredToken() ?? ''}` }
});

export const membersRoute = async (url) => {
    try
    {
        const { data } = await axios.get(url, authHeader());
        return data
    }
    catch(err)
    {
        console.error(err.message);
        throw new Error('Failed to fetch members', err.message);
    }
};

export const newMemberRoute = async (newMember, url) => {
    try
    {
        const { data } = await axios.post(url, newMember, authHeader());
        return data
    }
    catch(err)
    {
        console.error(err.message);
        throw new Error('Failed to add new member', err.message);
    }
};

export const newSubscriptionRoute = async (newSubscription, url) => {
    try
    {
        const { data } = await axios.post(url, newSubscription, authHeader());
        return data
    }
    catch(err)
    {
        console.error(err.message);
        const body = err.response && err.response.data;
        const msg = body && typeof body.message === "string" ? body.message : err.message;
        throw new Error(msg || 'Failed to subscribe movie to member');
    }
};

export const editMemberRoute = async (form, url) => {
    try
    {
        const { data } = await axios.put(url, form, authHeader());
        return data
    }
    catch(err)
    {
        console.error(err.message);
        throw new Error('Failed to edit member', err.message);
    }
};

export const deleteMemberRoute = async (id, url) => {
    try
    {
        const deleteUrlQueries = `${url}?id=${id}`;
        const { data } = await axios.delete(deleteUrlQueries, authHeader());
        return data
    }
    catch(err)
    {
        console.error(err.message);
        throw new Error('Failed to delete member', err.message);
    }
};

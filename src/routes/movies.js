import axios from 'axios';
import { readStoredToken } from '../utils/sessionLogout';

const authHeader = () => ({
    headers: { Authorization: `Bearer ${readStoredToken() ?? ''}` }
});

export const loadingMoviesRoute = async (url) => {
    try
    {
        const { data } = await axios.get(url, authHeader());
        return data
    }
    catch(err)
    {
        console.error(err.message);
        throw new Error('Failed to load movies', err.message);
    }
};


export const editMovieRoute = async (movieDetails, url) => {
    try
    {
        const { data } = await axios.put(url, movieDetails, authHeader());
        return data
    }
    catch(err)
    {
        console.error(err.message);
        throw new Error('Failed to edit movie', err.message);
    }
};


export const addMovieRoute = async (newMovie, url) => {
    try
    {
        const { data } = await axios.post(url, newMovie, authHeader());
        return data
    }
    catch(err)
    {
        console.error(err.message);
        throw new Error('Failed to add new movie', err.message);
    }
};


export const deleteMovieRoute = async (_id, url) => {
    try
    {
        const queriesUrl = `${url}?_id=${_id}`;
        const { data } = await axios.delete(queriesUrl, authHeader());
        return data
    }
    catch(err)
    {
        console.error(err.message);
        throw new Error('Failed to delete movie', err.message);
    }
};

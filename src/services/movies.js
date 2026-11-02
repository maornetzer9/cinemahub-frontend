import { SUBSCRIPTIONS } from "../config/serviceUrls";
import { addMovieAction, deleteMovieAction, editMovieAction, loadingMoviesAction } from "../actions/movies";
import { hasAuthToken } from "../utils/sessionLogout";

export const loadingMovies = async (dispatch) => {
    if (!hasAuthToken()) return;
    try 
    {
        const MOVIES = `${SUBSCRIPTIONS}/movies/`;
        await dispatch(loadingMoviesAction(MOVIES));
    } 
    catch(err) 
    {
        console.error(err.message);
        throw new Error(err.message);
    }
};


export const addMovieService = async (newMovie, dispatch) => {
    try
    {
        const ADD_MOVIES = `${SUBSCRIPTIONS}/movies/add`;
        const { code, message } = await dispatch(addMovieAction( newMovie, ADD_MOVIES )); 
        return { code, message };
    }
    catch(err)
    {
        console.error(err.message);
        throw new Error(err.message);
    }
};


export const editMovieService = async (editMovieDetails, dispatch) => {
    try
    {
        const EDIT_MOVIE = `${SUBSCRIPTIONS}/movies/edit`;
        const { code, message } = await dispatch(editMovieAction(editMovieDetails, EDIT_MOVIE));
        return { code, message };
    }
    catch(err)
    {
        console.error(err.message);
        throw new Error(err.message);
    }
};


export const deleteMovieById = async (_id, dispatch) => {
    try 
    {
        const DELETE_MOVIE = `${SUBSCRIPTIONS}/movies/delete`;
        const { code, message } = await dispatch(deleteMovieAction(_id, DELETE_MOVIE));
        return { code, message };
    } 
    catch(err) 
    {
        console.error(err.message);
        throw new Error(err.message);
    }
};
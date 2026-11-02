import { addMovieRoute, deleteMovieRoute, editMovieRoute, loadingMoviesRoute } from "../routes/movies";

export const MOVIES_START_LOADING = 'MOVIES_START_LOADING';
export const MOVIES_LOADING_FAILURE = 'MOVIES_LOADING_FAILURE';
export const MOVIES_LOADING_SUCCESS = 'MOVIES_LOADING_SUCCESS';

export const EDIT_MOVIE_LOADING = 'EDIT_MOVIE_LOADING';
export const EDIT_MOVIE_SUCCESS = 'EDIT_MOVIE_SUCCESS';
export const EDIT_MOVIE_FAILURE = 'EDIT_MOVIE_FAILURE';

export const ADD_MOVIE_LOADING = 'ADD_MOVIE_LOADING';
export const ADD_MOVIE_SUCCESS = 'ADD_MOVIE_SUCCESS';
export const ADD_MOVIE_FAILURE = 'ADD_MOVIE_FAILURE';

export const DELETE_MOVIE_LOADING = 'DELETE_MOVIE_LOADING';
export const DELETE_MOVIE_SUCCESS = 'DELETE_MOVIE_SUCCESS';
export const DELETE_MOVIE_FAILURE = 'DELETE_MOVIE_FAILURE';


export const loadingMoviesAction = (url) => async ( dispatch ) => {
    try
    {
        dispatch({type: MOVIES_START_LOADING});
        const response = await loadingMoviesRoute(url);
        const { code, message, movies } = response;

        if(code !== 200)
        {
            dispatch({type: MOVIES_LOADING_FAILURE, payload: message});
            return { code, message };
        } 
        dispatch({type: MOVIES_LOADING_SUCCESS, payload: movies})
        return { code, message };
    }
    catch(err)
    {
        console.error(err.message);
        dispatch({type: MOVIES_LOADING_FAILURE, payload: err.message});
    }
};

export const editMovieAction = (movieDetails, url) => async ( dispatch ) => {
    try
    {
        dispatch({type: EDIT_MOVIE_LOADING});
        const response = await editMovieRoute(movieDetails, url);
        const { code, message, movie, movies } = response;

        if(code !== 200)
        {
            dispatch({type: EDIT_MOVIE_FAILURE, payload: message});
            return { code, message };
        } 
        dispatch({type: EDIT_MOVIE_SUCCESS, payload: { movie, movies }});
        return { code, message };
    }
    catch(err)
    {
        console.error(err.message);
        dispatch({type: EDIT_MOVIE_FAILURE, payload: err.message});
    }
};

export const addMovieAction = (newMovie, url) => async ( dispatch ) => {
    try
    {
        dispatch({type: ADD_MOVIE_LOADING});
        const response = await addMovieRoute(newMovie, url);
        const { code, message, movie } = response;

        if(code !== 200)
        {
            dispatch({type: ADD_MOVIE_FAILURE, payload: message});
            return { code, message };
        } 
        dispatch({type: ADD_MOVIE_SUCCESS, payload: movie });
        return { code, message };
    }
    catch(err)
    {
        console.error(err.message);
        dispatch({type: ADD_MOVIE_FAILURE, payload: err.message});
    }
};

export const deleteMovieAction = (_id, url) => async ( dispatch ) => {
    try
    {
        dispatch({type: DELETE_MOVIE_LOADING});
        const response = await deleteMovieRoute(_id, url);
        const { code, message, movies } = response;

        if(code !== 200)
        {
            dispatch({type: DELETE_MOVIE_FAILURE, payload: message});
            return { code, message };
        } 
        dispatch({type: DELETE_MOVIE_SUCCESS, payload: movies });
        return { code, message };
    }
    catch(err)
    {
        console.error(err.message);
        dispatch({type: DELETE_MOVIE_FAILURE, payload: err.message});
    }
};


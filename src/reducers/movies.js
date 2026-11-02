import { 
    MOVIES_LOADING_SUCCESS, 
    MOVIES_LOADING_FAILURE, 
    MOVIES_START_LOADING, 
    EDIT_MOVIE_LOADING, 
    EDIT_MOVIE_SUCCESS, 
    EDIT_MOVIE_FAILURE, 
    DELETE_MOVIE_LOADING, 
    DELETE_MOVIE_FAILURE, 
    DELETE_MOVIE_SUCCESS, 
    ADD_MOVIE_LOADING, 
    ADD_MOVIE_SUCCESS, 
    ADD_MOVIE_FAILURE, 
} from '../actions/movies'

const initialState = {
    movie: {
        _id: '',
        image: '',
        genres: [],
        premiered: ''
    },
    movies: [],
    loading: false,
    error: null
};


export const moviesReducer = ( state = initialState, action ) => {
    switch (action.type)
    {
        case MOVIES_LOADING_SUCCESS: {
            return {
                ...state,
                movies: action.payload,
                movie: state.movie,
                loading: false,
                error: null
            };
        }

        case ADD_MOVIE_SUCCESS: {
            return {
                ...state,
                movies: [...state.movies ,action.payload],
                movie: action.payload,
                loading: false,
                error: null
            };
        }

        case EDIT_MOVIE_SUCCESS: {
            return {
                ...state,
                movies: action.payload.movies,
                movie: action.payload.movie,
                loading: false,
                error: null
            };
        }

        case DELETE_MOVIE_SUCCESS: {
            return {
                ...state,
                movies: action.payload,
                movie: action.payload[0],
                loading: false,
                error: null
            };
        }

        case ADD_MOVIE_LOADING:
        case EDIT_MOVIE_LOADING:
        case DELETE_MOVIE_LOADING:
        case MOVIES_START_LOADING: {
            return {
                ...state,
                loading: true,
                error: null
            };
        }

        case ADD_MOVIE_FAILURE:
        case EDIT_MOVIE_FAILURE:
        case DELETE_MOVIE_FAILURE:
        case MOVIES_LOADING_FAILURE: {
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        }
        default: return state;
    }
}
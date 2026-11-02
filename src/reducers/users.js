import {
    LOGIN_USER_FAILURE,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_LOADING,
    REGISTER_USER_LOADING,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAILURE,
    ADD_NEW_USER_LOADING,
    ADD_NEW_USER_SUCCESS,
    ADD_NEW_USER_FAILURE,
    LOADING_USERS_SUCCESS,
    LOADING_USERS_LOADING,
    LOADING_USERS_FAILURE,
    DELETE_USER_LOADING,
    DELETE_USER_FAILURE,
    DELETE_USER_SUCCESS,
    EDIT_USER_LOADING,
    EDIT_USER_FAILURE,
    EDIT_USER_SUCCESS,
    DISCONNECT_USER_FAILURE,
    DISCONNECT_USER_SUCCESS,
} from "../actions/users";

const initialState = {
    user: {
        _id: "",
        username: "",
        firstName: "",
        lastName: "",
        permissions: [],
        sessionTimeout: 0,
        createAt: new Date().toLocaleDateString()
    },
    users: [],
    loading: false,
    error: null,
};

export const userReducer = (state = initialState, action) => {
    switch (action.type) 
    {
        case LOGIN_USER_LOADING:
        case REGISTER_USER_LOADING:
        case LOADING_USERS_LOADING:
        case ADD_NEW_USER_LOADING:
        case EDIT_USER_LOADING:
        case DELETE_USER_LOADING: {
            return {
                ...state,
                loading: true,
                error: null,
            };
        }

        case LOADING_USERS_SUCCESS: {
            return {
                ...state,
                users: action.payload,
                loading: false,
                error: null,
            };
        }

        case LOGIN_USER_SUCCESS: {
            return {
                ...state,
                user: action.payload,
                loading: false,
                error: null,
            };
        }

        case REGISTER_USER_SUCCESS: {
            return {
                ...state,
                loading: false,
                error: null,
            };
        }

        case ADD_NEW_USER_SUCCESS: {
            return {
                ...state,
                users: [...state.users, action.payload],
                loading: false,
                error: null,
            };
        }

        case EDIT_USER_SUCCESS: {
            return {
                ...state,
                users: action.payload.users,
                loading: false,
                error: null,
            };
        }

        case DELETE_USER_SUCCESS: {
            return {
                ...state,
                users: action.payload,
                loading: false,
                error: null,
            };
        }

        case DISCONNECT_USER_SUCCESS: {
            const updatedUsers = state.users.filter(user => user._id !== action.payload._id);
        
            return {
                ...state,
                users: updatedUsers,
                user: initialState.user,
                loading: false,
                error: null,
            };
        }
        
        case LOGIN_USER_FAILURE:
        case REGISTER_USER_FAILURE:
        case ADD_NEW_USER_FAILURE:
        case LOADING_USERS_FAILURE:
        case DELETE_USER_FAILURE:
        case EDIT_USER_FAILURE:
        case DISCONNECT_USER_FAILURE: {
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        }
        default: return state;
    }
};

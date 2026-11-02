import { BUTTON_PERMISSION_LOADING, BUTTON_PERMISSION_SUCCESS, BUTTON_PERMISSIONS_FAILURE } from "../actions/buttons";

const initialState = {
    loading: false,
    buttonsPermissions: null,
    err: null,
};

export const buttonsReducer = (state = initialState, action) => {
    switch (action.type) 
    {
        case BUTTON_PERMISSION_LOADING:
            return {
                ...state,
                loading: true,
                err: null,
            };
        case BUTTON_PERMISSION_SUCCESS: 
            return {
                ...state,
                buttonsPermissions: action.payload,
                loading: false,
                err: null,
            };
        case BUTTON_PERMISSIONS_FAILURE:
            return {
                ...state,
                loading: false,
                err: action.payload,
            };
        default: return state;
    }
};

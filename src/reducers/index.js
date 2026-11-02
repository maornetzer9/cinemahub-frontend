import { combineReducers } from "redux";
import { userReducer } from './users'
import { moviesReducer } from "./movies";
import { membersReducer } from "./members";
import { buttonsReducer } from "./buttons";
import { RESET_APP_STATE } from "../actions/app";

const appReducer = combineReducers({
    userReducer,
    moviesReducer,
    membersReducer,
    buttonsReducer
});

export const rootReducer = (state, action) => {
    if (action.type === RESET_APP_STATE) {
        return appReducer(undefined, action);
    }
    return appReducer(state, action);
};
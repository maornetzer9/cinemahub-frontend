import { rootReducer } from './index.js';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
    reducer: rootReducer
});
import { configureStore } from '@reduxjs/toolkit';
import pathReducer from './path/pathSlice';

export const store  = configureStore({
    reducer: {
        currentRepoPath: pathReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { createSlice } from "@reduxjs/toolkit";

type PathState = {
    path: string
}

const savedCurrentRepoPath = localStorage.getItem("currentRepoPath");

const initialState: PathState = {
    path: savedCurrentRepoPath ? savedCurrentRepoPath : ""
};

const PathSlice = createSlice({
    name: "currentRepoPath",
    initialState,
    reducers: {
        set: (state, action) => {
            state.path = action.payload;
            localStorage.setItem("currentRepoPath", action.payload);
        }
    }
});

export const {set} = PathSlice.actions;

export default PathSlice.reducer;
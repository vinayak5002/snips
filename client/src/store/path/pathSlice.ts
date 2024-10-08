import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

type PathState = {
    path: string;
};

const savedCurrentRepoPath = localStorage.getItem("currentRepoPath");

const initialState: PathState = {
    path: savedCurrentRepoPath ? savedCurrentRepoPath : ""
};

export const updateCurrentRepoPath = createAsyncThunk(
    "currentRepoPath/updateCurrentRepoPath",
    async (newPath: string) => {
        try {
            console.log("Sending POST request with body: ", newPath);
            const response = await axios.post("http://localhost:5000/current-repo", { newRepoPath: newPath });
            // const response = await axios.post("http://localhost:5000/current-repo", { newPath: newPath });
            return response.data;
        } catch (err) {
            console.error("POST: Updating user current repo path failed", err);
            throw new Error("Failed to update path");
        }
    }
);

const PathSlice = createSlice({
    name: "currentRepoPath",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder.addCase(updateCurrentRepoPath.fulfilled, (state: PathState, action: PayloadAction<string>) => {
            state.path = action.payload;
            localStorage.setItem("currentRepoPath", action.payload);
            console.log("POST: Updating user current repo path succeeded");
        });
        builder.addCase(updateCurrentRepoPath.rejected, (state, action) => {
            console.error("Failed to update path", action.error);
        });
    }
});

export default PathSlice.reducer;

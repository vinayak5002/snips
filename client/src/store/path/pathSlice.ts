// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

type PathState = {
    path: string
}

const savedCurrentRepoPath = localStorage.getItem("currentRepoPath");

const initialState: PathState = {
    path: savedCurrentRepoPath ? savedCurrentRepoPath : ""
};

// const postCurrentRepoPath = createAsyncThunk(
//     "currentRepoPath/postCurrentRepoPath",
//     async (newPath: string, {dispatch}) => {
//         try {
            
//             const response = await axios.post("http://localhost:5000/current-repo", {path: newPath})

//         }
//         catch (err) {
//             console.log("POST: Updating user current repo path failed");
//         }
//     }
// );

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
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import snipsApi from "../../api/snipsApi";

type PathState = {
  path: string;
  lastIndexed: string;
};

const savedCurrentRepoPath = localStorage.getItem("currentRepoPath");
const savedLastIndexed = localStorage.getItem("lastIndexed");

const initialState: PathState = {
  path: savedCurrentRepoPath ? savedCurrentRepoPath : "",
  lastIndexed: savedLastIndexed ? savedLastIndexed : "",
};

export const updateCurrentRepoPath = createAsyncThunk(
  "currentRepoPath/updateCurrentRepoPath",
  async (newPath: string) => {
    try {
      console.log("Sending POST request with body: ", newPath);
      const data = await snipsApi.setCurrentRepo(newPath);
      console.log("Updated current repo path: ", data);
      return data;
    } catch (err) {
      console.error("POST: Updating user current repo path failed", err);
      throw new Error("Failed to update path");
    }
  }
);

const PathSlice = createSlice({
  name: "currentRepoPath",
  initialState,
  reducers: {
    setLastIndexed: (state, action) => {
      state.lastIndexed = action.payload;
      localStorage.setItem("lastIndexed", action.payload);
    }
  },

  extraReducers: (builder) => {
    builder.addCase(
      updateCurrentRepoPath.fulfilled,
      (state: PathState, action: PayloadAction<PathState>) => {
        state.path = action.payload.path;
        state.lastIndexed = action.payload.lastIndexed;
        localStorage.setItem("currentRepoPath", action.payload.path);
        console.log("POST: Updating user current repo path succeeded");
      }
    );
    builder.addCase(updateCurrentRepoPath.rejected, (state, action) => {
      console.error("Failed to update path", state.path, action.error);
    });
  },
});

export const {setLastIndexed} = PathSlice.actions; // exporting of the reducers

export default PathSlice.reducer;

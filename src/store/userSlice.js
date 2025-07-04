import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  isLoaded: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
      state.isLoaded = true;
      state.error = null;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.isLoaded = false;
      state.error = null;
    },
    setUserError: (state, action) => {
      state.error = action.payload;
      state.isLoaded = true;
    },
    resetUserState: (state) => {
      return initialState;
    },
  },
});

export const { setUser, clearUser, setUserError, resetUserState } = userSlice.actions;
export default userSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null, // hoặc {}
  isLoaded: false, // dùng để kiểm tra đã fetch xong chưa
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
      state.isLoaded = true;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.isLoaded = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

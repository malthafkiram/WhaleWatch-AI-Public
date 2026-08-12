import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  isLoggedIn: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthSuccess(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isLoggedIn = true;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    updatePremiumStatus(state, action) {
      if (state.user) {
        state.user.isPremium = action.payload;
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },

    setLogout(state) {
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;
      localStorage.clear();
    },
  },
});

export const { setAuthSuccess, updatePremiumStatus, setLogout } =
  authSlice.actions;
export default authSlice.reducer;

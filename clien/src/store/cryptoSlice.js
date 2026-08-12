import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  coins: [],
  loading: false,
  error: null,

  gameStatus: localStorage.getItem("ww_game_status") || "IDLE",
};

const cryptoSlice = createSlice({
  name: "crypto",
  initialState,
  reducers: {
    fetchCoinsStart: (state) => {
      state.loading = true;
    },
    fetchCoinsSuccess: (state, action) => {
      state.coins = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchCoinsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    setGameStatusGlobal: (state, action) => {
      state.gameStatus = action.payload;
      localStorage.setItem("ww_game_status", action.payload);
    },
  },
});

export const {
  fetchCoinsStart,
  fetchCoinsSuccess,
  fetchCoinsFailure,
  setGameStatusGlobal,
} = cryptoSlice.actions;

export default cryptoSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    setWatchlist: (state, action) => {
      state.items = action.payload;
    },
    addToWatchlist: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateWatchlistNotes: (state, action) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (index !== -1) {
        state.items[index].notes = action.payload.notes;
      }
    },
    removeFromWatchlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const {
  setWatchlist,
  addToWatchlist,
  updateWatchlistNotes,
  removeFromWatchlist,
} = watchlistSlice.actions;
export default watchlistSlice.reducer;

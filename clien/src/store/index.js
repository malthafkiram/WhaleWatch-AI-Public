import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import cryptoReducer from "./cryptoSlice.js";
import watchlistReducer from "./watchlistSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    crypto: cryptoReducer,
    watchlist: watchlistReducer,
  },
});

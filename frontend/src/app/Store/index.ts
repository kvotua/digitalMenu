import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import filterSlice from "./slices/filterSlice";

export const store = configureStore({
  reducer: {
    userSlice,
    filterSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

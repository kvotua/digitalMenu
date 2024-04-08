import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "filter",
  initialState: {
    id: "",
  },
  reducers: {
    setFilter(state, { payload }: PayloadAction<string>) {
      state.id = payload;
    },
  },
});

export default filterSlice.reducer;

export const { setFilter } = filterSlice.actions;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "src/app/Types/user.type";

const initialState: IUser = {
  id: "",
  likes: { compositions: [], products: [] },
  username: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(_, { payload }: PayloadAction<IUser>) {
      return payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "src/app/Types/user.type";

const initialState: Partial<IUser> = {
  id: "",
  likes: { compositions: [], products: [] },
  username: "",
  email: "",
  name: "",
  phone: "",
  surname: "",
  cart: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, { payload }: PayloadAction<Partial<IUser>>) {
      if (payload.phone) {
        payload.phone = payload.phone.replace(/^tel:/, "");
      }
      return { ...state, ...payload };
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;

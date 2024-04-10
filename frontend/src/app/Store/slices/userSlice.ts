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
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(
      _,
      {
        payload,
      }: PayloadAction<Omit<IUser, "name" | "surname" | "email" | "phone">>
    ) {
      return payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;

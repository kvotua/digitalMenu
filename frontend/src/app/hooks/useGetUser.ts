import { useMutation, useQuery } from "react-query";
import { useAppDispatch } from "./useAppDispatch";
import { api } from "../Http";
import { IUser } from "../Types/user.type";
import { setUser } from "../Store/slices/userSlice";
import { useEffect } from "react";

export const useGetUser = () => {
  const dispatch = useAppDispatch();
  const { mutate } = useMutation({
    mutationKey: ["postUser"],
    mutationFn: async () => {
      if (!localStorage.getItem("token")) {
        return api
          .post("/users/")
          .then(({ data: token }) => localStorage.setItem("token", token));
      }
    },
  });
  useQuery({
    queryKey: "getUser",
    queryFn: async () => {
      if (localStorage.getItem("token")) {
        return api
          .get<IUser>("/users/me", {
            headers: {
              token: localStorage.getItem("token"),
            },
          })
          .then(({ data }) => data);
      }
    },
    onSuccess: (data: IUser) => dispatch(setUser(data)),
    enabled: !!localStorage.getItem("token"),
  });
  useEffect(mutate, []);
};

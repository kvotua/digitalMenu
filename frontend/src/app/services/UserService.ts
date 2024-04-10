import { useMutation } from "react-query";
import { apiWithAuth } from "../Http";
import { IUser } from "../Types/user.type";

class UserService {
  getUser() {}
  addUser() {}
  updataUser() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useMutation({
      mutationKey: "updateUser",
      mutationFn: (body: Omit<IUser, "id" | "likes" | "username" | "cart">) =>
        apiWithAuth.patch(`/users/credentials`, body),
    });
  }
  updatePassword() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useMutation({
      mutationKey: "updatePassword",
      mutationFn: ({ password }: { password: string }) =>
        apiWithAuth.put("/users/password", password),
    });
  }
}

export default new UserService();

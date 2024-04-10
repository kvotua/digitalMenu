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
      mutationFn: (body: Omit<IUser, "id" | "likes" | "username">) =>
        apiWithAuth.patch(`/users/credentials`, body),
    });
  }
  updatePassword() {
    apiWithAuth.put("");
  }
}

export default new UserService();

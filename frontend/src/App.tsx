import { useEffect } from "react";
import { Routing } from "./app/Routes/Routing";
import { useCookies } from "react-cookie";
import { useMutation, useQuery } from "react-query";
import { api } from "./app/Http";
import { IUser } from "./app/Types/user.type";
import { useAppDispatch } from "./app/hooks/useAppDispatch";
import { setUser } from "./app/Store/slices/userSlice";

function App() {
  const [token, setCookie] = useCookies(["userToken"]);
  const { mutate } = useMutation({
    mutationKey: ["postUser"],
    mutationFn: async () => {
      return api.post("/users/").then(({ data: token }) => {
        setCookie("userToken", token, { maxAge: 1000 * 60 * 60 * 24 * 30 });
        window.location.reload();
      });
    },
  });

  useEffect(() => {
    if (!token.userToken) {
      mutate();
    }
  }, [token]);
  const dispatch = useAppDispatch();
  useQuery({
    queryKey: "getUser",
    queryFn: async () => {
      if (token) {
        return api
          .get<IUser>("/users/me", {
            headers: {
              token: token.userToken,
            },
          })
          .then(({ data }) => data);
      }
    },
    onSuccess: (data: IUser) => dispatch(setUser(data)),
    enabled: !!token,
  });
  // if (
  //   !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  //     navigator.userAgent
  //   )
  // ) {
  //   return <>no</>;
  // }
  return <Routing />;
}

export default App;

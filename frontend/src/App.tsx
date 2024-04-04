import { useMutation } from "react-query";
import { Routing } from "./app/Routes/Routing";
import { api } from "./app/http";
import { useEffect } from "react";

function App() {
  const { mutate } = useMutation({
    mutationKey: [""],
    mutationFn: async () =>
      api
        .post("/users/")
        .then(({ data: token }) => localStorage.setItem("token", token)),
  });
  useEffect(mutate, []);
  return <Routing />;
}

export default App;

import { Routing } from "./app/Routes/Routing";
import { useGetUser } from "./app/hooks/useGetUser";

function App() {
  useGetUser()
  return <Routing />;
}

export default App;

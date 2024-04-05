import { Routing } from "./app/Routes/Routing";
import { useGetUser } from "./app/services/useGetUser";

function App() {
  useGetUser();
  return <Routing />;
}

export default App;

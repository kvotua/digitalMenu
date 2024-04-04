import { Route, Routes } from "react-router-dom";
import { appRoutes } from "./appRoutes";
import { Header } from "src/widgets/Header/Header";

const Routing: React.FC = () => {
  return (
    <Routes>
      <Route element={<Header />}>
        {appRoutes.map(({ Element, path }) => (
          <Route path={path} key={path} element={<Element />} />
        ))}
      </Route>
    </Routes>
  );
};

export { Routing };

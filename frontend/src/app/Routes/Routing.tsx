import { Route, Routes } from "react-router-dom";
import { appRoutes } from "./appRoutes";
import { Header } from "src/widgets/Header/Header";
import { RoutingConstants } from "../Constants/RoutingConstants";
import { Home } from "src/pages/Home/Home";

const Routing: React.FC = () => {
  return (
    <Routes>
      <Route element={<Header />}>
        <Route path={RoutingConstants.HOME} element={<Home />} />
        <Route path={RoutingConstants.HOME} element={<Home />} />

      </Route>
      {appRoutes.map(({ Element, path }) => (
        <Route path={path} key={path} element={<Element />} />
      ))}
    </Routes>
  );
};

export { Routing };

import { Route, Routes } from "react-router-dom";
import { appRoutes, authRoutes } from "./appRoutes";
import { Header } from "src/widgets/Header/Header";
import { RoutingConstants } from "../Constants/RoutingConstants";
import { Home } from "src/pages/Home/Home";
import { Admin } from "src/pages/Admin/Admin";

const Routing: React.FC = () => {
  const isAuth = true;
  return (
    <Routes>
      <Route element={<Header />}>
        <Route path={RoutingConstants.HOME} element={<Home />} />
        <Route path={RoutingConstants.ADMIN} element={<Admin />} />
      </Route>
      {appRoutes.map(({ Element, path }) => (
        <Route path={path} key={path} element={<Element />} />
      ))}
      {isAuth &&
        authRoutes.map(({ Element, path }) => (
          <Route path={path} key={path} element={<Element />} />
        ))}
    </Routes>
  );
};

export { Routing };

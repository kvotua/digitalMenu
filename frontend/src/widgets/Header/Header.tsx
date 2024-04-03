import { Outlet } from "react-router-dom";
import style from "./Header.module.scss";

const Header: React.FC = () => {
  return (
    <>
      <header className={style.header}>Header</header>
      <Outlet />
    </>
  );
};

export { Header };

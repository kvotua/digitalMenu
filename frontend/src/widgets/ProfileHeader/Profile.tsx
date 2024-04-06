import { Link, Outlet } from "react-router-dom";
import { BottomPanel } from "../BottomPanel/BottomPanel";

const ProfileHeader: React.FC = () => {
  return (
    <>
      <header className="container pt-5">
        <div className="flex flex-col items-center">
          <img src="/profile.svg" className="w-20 mx-auto" alt="profile" />
          <span className="uppercase font-bold">Пользователь</span>
        </div>
        <ul className="flex justify-center gap-5 py-5">
          <li>
            <Link to={"/profile/1"}>Данные</Link>
          </li>
          <li>
            <Link to={`/profile/1/favorite`} relative="path">
              Избранное
            </Link>
          </li>
        </ul>
      </header>
      <Outlet />
      <BottomPanel />
    </>
  );
};

export { ProfileHeader };

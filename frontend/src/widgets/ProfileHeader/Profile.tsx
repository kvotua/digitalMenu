import { Link, Outlet } from "react-router-dom";
import { useAppSelector } from "src/app/hooks/useAppSelector";
import Pencil from "src/app/assets/pencil.svg?react";

const ProfileHeader: React.FC = () => {
  const user = useAppSelector((state) => state.userSlice);

  return (
    <>
      <header className="container pt-5">
        <div className="flex flex-col items-center">
          <div className="relative">
            <Link to={`/profile/${user.id}/settings`}>
              <Pencil className="w-10 h-10 absolute -top-2 -right-2" />
            </Link>
            <img src="/profile.svg" className="w-20 mx-auto" alt="profile" />
          </div>
          <span className="uppercase font-bold">
            {user.username !== "" ? user.username : "Пользователь"}
          </span>
        </div>
      </header>
      <Outlet />
    </>
  );
};

export { ProfileHeader };

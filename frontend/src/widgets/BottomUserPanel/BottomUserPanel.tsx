import { Link } from "react-router-dom";

import style from "./BottomUserPanel.module.scss";
import { useAppSelector } from "src/app/hooks/useAppSelector";
import Cart from "src/app/assets/cart.svg?react";

const BottomUserPanel: React.FC = () => {
  const user = useAppSelector((state) => state.userSlice);
  return (
    <div className={style.panel__container}>
      <Link to={"/search"} className="w-8 h-8 justify-self-start rounded-full">
        <img src="/search.svg" />
      </Link>
      {user.username ? (
        <Link
          to={user ? `/profile/` : ""}
          className="w-8 h-8 justify-self-end rounded-full"
        >
          <img src={user ? "/profile.svg" : "/login.svg"} />
        </Link>
      ) : (
        <Link to={"/auth"} className="w-8 h-8 justify-self-end rounded-full">
          <img src={user ? "/login.svg" : "/login.svg"} />
        </Link>
      )}
      <Link
        to={"/cart"}
        className="w-8 h-8 rounded-full col-span-2 justify-self-center"
      >
        <Cart className="stroke-black/40" />
      </Link>
    </div>
  );
};

export { BottomUserPanel };

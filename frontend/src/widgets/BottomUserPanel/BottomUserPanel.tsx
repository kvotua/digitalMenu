import { Link } from "react-router-dom";

import style from "./BottomUserPanel.module.scss";
import { useAppSelector } from "src/app/hooks/useAppSelector";
import Cart from "src/app/assets/cart.svg?react";
import { useMemo } from "react";

const BottomUserPanel: React.FC = () => {
  const user = useAppSelector((state) => state.userSlice);
  return useMemo(() => {
    return (
      <div className={style.panel__container}>
        <Link
          to={"/search"}
          className="w-8 h-8 justify-self-start rounded-full"
        >
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
        {user.name === "admin" && (
          <Link
            to={"/cart"}
            className="w-8 h-8 rounded-full col-span-2 justify-self-center relative"
          >
            {user.cart && Object.keys(user?.cart).length > 0 && (
              <div className="w-5 h-5 bg-red-500 rounded-full absolute -top-2 -right-2 flex justify-center items-center text-white">
                {Object.keys(user?.cart).length}
              </div>
            )}
            <Cart className=" stroke-[#ae88f1]" />
          </Link>
        )}
      </div>
    );
  }, [user]);
};

export { BottomUserPanel };

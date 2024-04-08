import { Link } from "react-router-dom";
import style from "./BottomUserPanel.module.scss";
import { useAppSelector } from "src/app/hooks/useAppSelector";

const BottomUserPanel: React.FC = () => {
  const user = useAppSelector((state) => state.userSlice);
  return (
    <div className={style.panel__container}>
      <Link to={"/search"} className="w-8 h-8 justify-self-start rounded-full">
        <img src="/search.svg" />
      </Link>
      {user.username ? (
        <Link
          to={user ? `/profile/${user.id}` : "/auth"}
          className="w-8 h-8 justify-self-end rounded-full"
        >
          <img src={user ? "/profile.svg" : "/login.svg"} onClick={() => {}} />
        </Link>
      ) : (
        <Link to={"/auth"} className="w-8 h-8 justify-self-end rounded-full">
          <img src={user ? "/login.svg" : "/login.svg"} onClick={() => {}} />
        </Link>
      )}
    </div>
  );
};

export { BottomUserPanel };

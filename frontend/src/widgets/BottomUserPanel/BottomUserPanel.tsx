import { Link } from "react-router-dom";
import style from "./BottomUserPanel.module.scss";

const BottomUserPanel: React.FC = () => {
  const isAuth = false;
  return (
    <div className={style.panel__container}>
      <Link to={"/search"} className="w-8 h-8 justify-self-start rounded-full">
        <img src="/search.svg" />
      </Link>

      <Link
        to={isAuth ? "/profile" : "/auth"}
        className="w-8 h-8 justify-self-end rounded-full"
      >
        <img src={isAuth ? "/profile.svg" : "/login.svg"} onClick={() => {}} />
      </Link>
    </div>
  );
};

export { BottomUserPanel };

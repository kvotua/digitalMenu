import { Link, Outlet } from "react-router-dom";
import style from "./Header.module.scss";
import { mokTags } from "./Tag.mok";
import { useState } from "react";
import { Tag } from "src/features/Tag/Tag";

const Header: React.FC = () => {
  const [tagId, setTagId] = useState<string>("0");
  return (
    <>
      <header className={style.header}>
        <ul className={style.container}>
          <Tag
            color={"red"}
            title={"все"}
            id={"0"}
            tagId={tagId}
            setTagId={() => setTagId("0")}
          />
          {mokTags.map(({ color, title, id }) => (
            <li key={id}>
              <Tag
                color={color}
                title={title}
                id={id}
                tagId={tagId}
                setTagId={() => setTagId(id)}
              />
            </li>
          ))}
        </ul>

        <Link to={"/cart"} className={style.cart}>
          <div className={style.innerTags}>
            <img src="/cart.svg" className="w-10 h-10" />
          </div>
          <span className={style.innerText}>Корзина</span>
        </Link>
      </header>
      <Outlet />
    </>
  );
};

export { Header };

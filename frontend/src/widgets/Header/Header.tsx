import { Link, Outlet } from "react-router-dom";
import style from "./Header.module.scss";
import { useState } from "react";
import { Tag } from "src/features/Tag/Tag";
import { useGetTags } from "src/app/services/useGetTags";
import { useAppDispatch } from "src/app/hooks/useAppDispatch";
import { setFilter } from "src/app/Store/slices/filterSlice";

const Header: React.FC = () => {
  const [tagId, setTagId] = useState<string>("0");
  const { data: tags } = useGetTags();
  const dispatch = useAppDispatch();
  const isAdmin = true;
  return (
    <>
      <header className={`${style.header}`}>
        <ul className={style.container}>
          <Tag
            color={"red"}
            title={"все"}
            id={"0"}
            tagId={tagId}
            setTagId={() => {
              dispatch(setFilter(""));
              setTagId("0");
            }}
          />
          {tags?.map(({ color, name, id }) => (
            <li key={id} onClick={() => dispatch(setFilter(id))}>
              <Tag
                color={color}
                title={name}
                id={id}
                tagId={tagId}
                setTagId={() => setTagId(id)}
              />
            </li>
          ))}
        </ul>
        {isAdmin ? (
          <Link to={"/tag/add"} className={style.cart}>
            <div className={style.innerTags}>
              <img src="/add.svg" className="w-10 h-10" />
            </div>
            <span className={style.innerText}>Добавить</span>
          </Link>
        ) : (
          <Link to={"/cart"} className={style.cart}>
            <div className={style.innerTags}>
              <img src="/cart.svg" className="w-10 h-10" />
            </div>
            <span className={style.innerText}>Корзина</span>
          </Link>
        )}
      </header>
      <Outlet />
    </>
  );
};

export { Header };

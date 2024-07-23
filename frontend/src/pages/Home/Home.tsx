import { useQuery } from "react-query";
import { apiWithAuth } from "src/app/Http";
import { CardComposotion } from "src/entities/CardComposition/CardComposotion";
import style from "./Home.module.scss";
import { Link } from "react-router-dom";
import { Masonry } from "@mui/lab";
import { useAppSelector } from "src/app/hooks/useAppSelector";
import { BottomUserPanel } from "src/widgets/BottomUserPanel/BottomUserPanel";
import { useState } from "react";
import Upload from "src/app/assets/upload.svg?react";

const Home: React.FC = () => {
  const [load, isLoad] = useState(0);
  const tagId = useAppSelector((state) => state.filterSlice.id);
  const likes = useAppSelector((state) => state.userSlice.likes?.compositions);
  const { data: compositions = [] } = useQuery({
    queryKey: ["getCompositions", tagId],
    queryFn: async () => {
      if (tagId !== "likes") {
        return apiWithAuth
          .get<string[]>(`/compositions/${tagId && `?tag=${tagId}`}`)
          .then(({ data }) => data);
      }
      return Promise.resolve(likes);
    },
  });
  const userName = useAppSelector((state) => state.userSlice.username);
  return (
    <main className="container flex flex-col">
      <br />
      <div className="content_container">
        <>
           <h1 className="">Композиции</h1><br />
            </>
      
            
      <Masonry
        className="!m-0 flex-grow"
        columns={{ md: 2, sm: 2, xs: 2 }}
        spacing={0.9}
        defaultColumns={2}
        sequential
      >
        {userName === "admin" && (
          <>
            {/* <Link to={"/add/productManagement"} className={style.addButton}>
              Управление <br /> продуктами
            </Link> */}

            {/* <Link to={"add/product/"} className={style.addButton}>
              <Upload className=" text-black" />
              Добавить <br /> продукт
            </Link> */}
          </>
        )}
        
        {compositions?.map((item: string) => (
          <CardComposotion
            key={item}
            id={item}
            image={`${import.meta.env.VITE_API_URL}/compositions/${item}/image`}
            composition={item}
          />
        ))}
      </Masonry>
      </div>

      <BottomUserPanel />
    </main>
  );
};

export { Home };

import { useQuery } from "react-query";
import { apiWithAuth } from "src/app/Http";
import { CardComposotion } from "src/entities/CardComposition/CardComposotion";
import style from "./Home.module.scss";
import { Link } from "react-router-dom";
import { Masonry } from "@mui/lab";
import { useAppSelector } from "src/app/hooks/useAppSelector";
import { BottomUserPanel } from "src/widgets/BottomUserPanel/BottomUserPanel";
import Upload from "src/app/assets/upload.svg?react";

const Home: React.FC = () => {
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
    <main className="container flex flex-col h-screen">
      <Masonry
        className="!m-0 flex-grow"
        columns={{ md: 3, sm: 2, xs: 2 }}
        spacing={0.9}
        defaultColumns={2}
      >
        {userName === "admin" && (
          <>
            <Link to={"add/composition/"} className={style.addButton}>
              <Upload className="w-5 h-5 stroke-black" />
              Добавить композицию
            </Link>
            <Link to={"add/product/"} className={style.addButton}>
              <Upload className="w-5 h-5 stroke-black" />
              Добавить продукт
            </Link>
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

      <BottomUserPanel />
    </main>
  );
};

export { Home };

import { useQuery } from "react-query";
import { apiWithAuth } from "src/app/Http";
import { CardComposotion } from "src/entities/CardComposition/CardComposotion";
import style from "./Home.module.scss";
import { Link } from "react-router-dom";
import { Masonry } from "@mui/lab";
import { useAppSelector } from "src/app/hooks/useAppSelector";
import { BottomUserPanel } from "src/widgets/BottomUserPanel/BottomUserPanel";

const Home: React.FC = () => {
  const tagId = useAppSelector((state) => state.filterSlice.id);
  const likes = useAppSelector((state) => state.userSlice.likes.compositions);
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
      {userName === "admin" && (
        <div className="flex gap-5 pb-5">
          <Link to={"add/composition/"} className={style.addButton}>
            Добавить композицию
          </Link>
          <Link to={"add/product/"} className={style.addButton}>
            Добавить продукт
          </Link>
        </div>
      )}
      <Masonry className="!m-0 flex-grow" columns={2} spacing={2}>
        {compositions?.map((item: string) => (
          <CardComposotion
            key={item}
            id={item}
            image={`${import.meta.env.VITE_API_URL}/compositions/${item}/image`}
          />
        ))}
      </Masonry>
      <BottomUserPanel />
    </main>
  );
};

export { Home };

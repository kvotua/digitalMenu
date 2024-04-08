import { useQuery } from "react-query";
import { apiWithAuth } from "src/app/Http";
import { CardComposotion } from "src/entities/CardComposition/CardComposotion";
import style from "./Home.module.scss";
import { Link } from "react-router-dom";
import { Masonry } from "@mui/lab";
import { useAppSelector } from "src/app/hooks/useAppSelector";

const Home: React.FC = () => {
  const tagId = useAppSelector((state) => state.filterSlice.id);
  const { data: compositions = [] } = useQuery({
    queryKey: ["getCompositions", tagId],
    queryFn: async () =>
      apiWithAuth
        .get<string[]>(`/compositions/${tagId && `?tag=${tagId}`}`)
        .then(({ data }) => data),
  });

  return (
    <main className="container flex flex-col h-screen">
      <div className="flex gap-5 pb-5">
        <Link to={"add/composition/"} className={style.addButton}>
          Добавить композицию
        </Link>
        <Link to={"add/product/"} className={style.addButton}>
          Добавить продукт
        </Link>
      </div>
      <Masonry className="!m-0" columns={2} spacing={2}>
        {compositions?.map((item: string) => (
          <CardComposotion
            key={item}
            id={item}
            image={`http://localhost:8000/compositions/${item}/image`}
          />
        ))}
        {/* <BottomUserPanel /> */}
      </Masonry>
    </main>
  );
};

export { Home };

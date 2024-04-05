import { useQuery } from "react-query";
import { apiWithAuth } from "src/app/Http";
import { IComposition } from "src/app/Types/composition.type";
import { CardComposotion } from "src/entities/CardComposition/CardComposotion";
import style from "./Home.module.scss";
import { Link } from "react-router-dom";
import { BottomUserPanel } from "src/widgets/BottomUserPanel/BottomUserPanel";

const Home: React.FC = () => {
  const tagId = "";
  const { data: compositions } = useQuery({
    queryKey: "getComposition",
    queryFn: async () =>
      apiWithAuth
        .get<Omit<IComposition, "points" | "tags">[]>(
          `/compositions/?tag=${tagId}`
        )
        .then(({ data }) => data),
  });
  return (
    <main className="container">
      <section className="columns-2 gap-3">
        <Link to={"add/composition/"} className={style.addButton}>
          Добавить композицию
        </Link>
        <Link to={"add/product/"} className={style.addButton}>
          Добавить продукт
        </Link>
        {compositions?.map(({ id }) => (
          <CardComposotion
            id={id}
            image={`${import.meta.env.VITE_API_URL}/composition/${id}/image`}
          />
        ))}
      </section>
      <BottomUserPanel />
    </main>
  );
};

export { Home };

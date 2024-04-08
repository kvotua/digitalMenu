import { useQuery } from "react-query";
import { apiWithAuth } from "src/app/Http";
import { CardComposotion } from "src/entities/CardComposition/CardComposotion";
import style from "./Home.module.scss";
import { Link } from "react-router-dom";
import { BottomUserPanel } from "src/widgets/BottomUserPanel/BottomUserPanel";

const Home: React.FC = () => {
  const tagId = "";
  const { data: compositions = [] } = useQuery({
    queryKey: "getCompositions",
    queryFn: async () =>
      apiWithAuth
        .get<string[]>(`/compositions/${tagId && `?tag=$${tagId}`}`)
        .then(({ data }) => data),
  });

  return (
    <main className="container flex flex-col h-screen">
      <section className="columns-2 gap-3 flex-grow">
        <Link to={"add/composition/"} className={style.addButton}>
          Добавить композицию
        </Link>
        <Link to={"add/product/"} className={style.addButton}>
          Добавить продукт
        </Link>
        {compositions?.map((item: string) => (
          <CardComposotion
            key={item}
            id={item}
            image={`${import.meta.env.VITE_API_URL}/compositions/${item}/image`}
          />
        ))}
      </section>
      <BottomUserPanel />
    </main>
  );
};

export { Home };

import { Link } from "react-router-dom";
import { ICardModelProps } from "./CardComposotion.model";
import style from "./CardComposition.module.scss";
const CardComposotion: React.FC<ICardModelProps> = ({
  id,
  image,
  // composition,
}) => {
  // const { data: compositionInfo } = useQuery({
  //   queryKey: "getCompositionInfo",
  //   queryFn: () =>
  //     apiWithAuth
  //       .get<IComposition>(`/compositions/${composition}`)
  //       .then(({ data }) => data),
  // });
  return (
    <Link to={`composition/${id}`} className={style.container}>
      {/* <div className="absolute top-0 right-0 flex pt-1 pr-1 items-center">
        <span className="text-2xl text-white ">{compositionInfo?.likes}</span>
        <Heart className="w-8 h-8 fill-white" />
        <Share className="w-8 h-8 fill-white" />
      </div> */}
      <img src={image} alt={image} className="w-full rounded-2xl" />
    </Link>
  );
};

export { CardComposotion };

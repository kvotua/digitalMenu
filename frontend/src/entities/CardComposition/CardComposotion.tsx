import { Link } from "react-router-dom";
import { ICardModelProps } from "./CardComposotion.model";
import style from "./CardComposition.module.scss";

const CardComposotion: React.FC<ICardModelProps> = ({ id, image }) => {
  return (
    <Link
      to={`composition/${id}`}
      className={style.container}
    >
      <img src={image} alt={image} className="w-full" />
    </Link>
  );
};

export { CardComposotion };

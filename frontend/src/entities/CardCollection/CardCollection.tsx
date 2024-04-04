import { Link } from "react-router-dom";
import { ICardModelProps } from "./CardCollection.model";
import style from "./CardCollection.module.scss";

const CardCollection: React.FC<ICardModelProps> = ({ id, image }) => {
  return (
    <Link to={`collection/${id}`} className={style.container}>
      <img src={image} alt={image} className="w-full" />
    </Link>
  );
};

export { CardCollection };
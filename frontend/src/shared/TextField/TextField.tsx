import { ITextField } from "./TextField.model";
import style from "./TextField.module.scss";

const TextField: React.FC<ITextField> = ({ setValue, value, ...props }) => (
  <input
    className={style.input}
    value={value}
    onChange={setValue}
    {...props}
    placeholder="Название"
    type="text"
  />
);

export { TextField };

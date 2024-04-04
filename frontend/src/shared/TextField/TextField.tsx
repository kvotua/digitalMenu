import { ITextField } from "./TextField.model";
import style from "./TextField.module.scss";

const TextField: React.FC<ITextField> = ({
  setValue,
  value,
  type = "text",
  big = false,
  ...props
}) => (
  <>
    {big ? (
      <textarea
        value={value}
        onChange={setValue}
        className={`${style.input} min-h-40 resize-none`}
        {...props}
      ></textarea>
    ) : (
      <input
        className={style.input}
        value={value}
        onChange={setValue}
        {...props}
        type={type}
      />
    )}
  </>
);

export { TextField };

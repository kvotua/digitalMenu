import { forwardRef } from "react";
import { ITextField } from "./TextField.model";
import style from "./TextField.module.scss";

const TextField: React.FC<ITextField> = forwardRef(
  (
    {
      setValue,
      value,
      type = "text",
      big = false,
      className,
      errorMessage,
      ...props
    },
    ref
  ) => (
    <>
      {big ? (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          value={value}
          onChange={setValue}
          className={`${style.input} min-h-40 resize-none ${className}`}
          {...props}
        ></textarea>
      ) : (
        <>
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            className={`${style.input} ${className}`}
            value={value}
            onChange={setValue}
            {...props}
            type={type}
          />
          <span>{errorMessage}</span>
        </>
      )}
    </>
  )
);

export { TextField };

import { forwardRef } from "react";
import { IButtonProps } from "./Button.model";

const Button: React.FC<IButtonProps> = forwardRef(
  ({ handleClick, title, ...props }, ref: React.Ref<HTMLButtonElement>) => (
    <button
      ref={ref}
      form="auth"
      onClick={handleClick}
      {...props}
      className="w-full p-4 text-white font-bold bg-[#ae88f1] rounded-2xl"
    >
      {title}
    </button>
  )
);

export { Button };

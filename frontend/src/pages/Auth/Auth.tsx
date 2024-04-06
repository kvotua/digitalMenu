import { Button } from "src/shared/Button/Button";
import { TextField } from "src/shared/TextField/TextField";
import { useForm } from "react-hook-form";
import { FormValues } from "./Auth.mode";
import { api } from "src/app/Http";
import { ErrorPopup } from "src/widgets/ErrorPopup/ErrorPopup";
import { BottomPanel } from "src/widgets/BottomPanel/BottomPanel";

const Auth: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const onSubmit = (data: FormValues) => {
    api.post("/create/user", data);
  };

  return (
    <main className="container wrapper flex flex-col justify-center items-center h-screen gap-5">
      <ErrorPopup
        errorMessage={errors.email?.message || errors.password?.message}
      />
      <img src="/smile.svg" className="w-20 -translate-y-20" alt="" />
      <form
        id="auth"
        className={`border ${
          errors.email || errors.password ? "border-red-500" : ""
        } p-5 rounded-2xl border-[#ae88f1]`}
        onSubmit={handleSubmit((data) => onSubmit(data))}
      >
        <TextField
          {...register("email", {
            required: "Введите эл. почту",
          })}
          className="border-none py-2"
          placeholder="Электронная почта"
        />
        <hr
          className={`border-[#ae88f1] mx-3 ${
            errors.email || errors.password ? "border-red-500" : ""
          }`}
        />
        <TextField
          {...register("password", {
            required: "Введите пароль",
          })}
          type="password"
          className="border-none py-2"
          placeholder="Пароль"
        />
      </form>
      <Button form="auth" type="submit" title="Войти" handleClick={() => {}} />
      <BottomPanel />
    </main>
  );
};

export { Auth };

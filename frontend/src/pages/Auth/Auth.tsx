import { Button } from "src/shared/Button/Button";
import { TextField } from "src/shared/TextField/TextField";
import { useForm } from "react-hook-form";
import { FormValues } from "./Auth.mode";
import { apiWithAuth } from "src/app/Http";
import { ErrorPopup } from "src/widgets/ErrorPopup/ErrorPopup";
import { BottomPanel } from "src/widgets/BottomPanel/BottomPanel";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";

const Auth: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const onSubmit = (data: FormValues) => {
    if (isReg) {
      apiWithAuth.post("/users/assign", data).then(() => setIsReg(false));
    } else {
      apiWithAuth.post("/users/login", data).then(({ data }) => {
        setCookie("userToken", data, { maxAge: 1000 * 60 * 60 * 24 * 30 });
        navigate("/");
        window.location.reload();
      });
    }
  };
  const [token, setCookie] = useCookies(["userToken"]);
  console.log(token);

  const navigate = useNavigate();
  const [isReg, setIsReg] = useState(false);
  return (
    <main className="container wrapper flex flex-col justify-center items-center h-screen ">
      <ErrorPopup
        errorMessage={errors.username?.message || errors.password?.message}
      />
      <div className="flex flex-col justify-center gap-5 items-center flex-grow">
        <img src="/smile.svg" className="w-20 -translate-y-20" alt="" />
        <form
          id="auth"
          className={`border ${
            errors.username || errors.password ? "border-red-500" : ""
          } p-5 rounded-2xl border-[#ae88f1]`}
          onSubmit={handleSubmit((data) => onSubmit(data))}
        >
          <TextField
            {...register("username", {
              required: "Логин",
            })}
            className="border-none py-2"
            placeholder="Электронная почта"
          />
          <hr
            className={`border-[#ae88f1] mx-3 ${
              errors.username || errors.password ? "border-red-500" : ""
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
        <Button
          form="auth"
          type="submit"
          title={!isReg ? "Войти" : "Зарегестрироваться"}
          handleClick={() => {}}
        />
        <span onClick={() => setIsReg(!isReg)}>
          {isReg ? "Войти" : "Зарегестрироваться"}
        </span>
      </div>
      <BottomPanel />
    </main>
  );
};

export { Auth };

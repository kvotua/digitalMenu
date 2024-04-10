import { useForm } from "react-hook-form";
import { setUser } from "src/app/Store/slices/userSlice";
import { IUser } from "src/app/Types/user.type";
import { useAppDispatch } from "src/app/hooks/useAppDispatch";
import { useAppSelector } from "src/app/hooks/useAppSelector";
import UserService from "src/app/services/UserService";
import { Button } from "src/shared/Button/Button";
import { TextField } from "src/shared/TextField/TextField";
import { BottomPanel } from "src/widgets/BottomPanel/BottomPanel";

const ProfileSettings: React.FC = () => {
  const user = useAppSelector((state) => state.userSlice);
  const {
    register: userData,
    formState: { isDirty: isDirtyUserData },
    handleSubmit,
  } = useForm<Omit<IUser, "id" | "likes" | "username" | "cart">>({
    values: {
      email: user.email ? user.email : "",
      name: user.name ? user.name : "",
      phone: user.phone ? user.phone : "",
      surname: user.surname ? user.surname : "",
    },
  });
  const {
    register: userPassword,
    formState: { isDirty: isDirtyUserPassword },
    handleSubmit: handleSubmitPassword,
  } = useForm<{ password: string }>({
    values: {
      password: "",
    },
  });

  const isEmail =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  const { mutate } = UserService.updataUser();
  const { mutate: updatePassword } = UserService.updatePassword();
  const onSubmit = (
    data: Omit<IUser, "id" | "likes" | "username" | "cart">
  ) => {
    mutate(data);
  };
  const dispatch = useAppDispatch();
  const handleFormSubmission = () => {
    handleSubmit((data) => {
      dispatch(setUser(data));
      onSubmit(data);
    })();
  };
  return (
    <div className="flex flex-col h-[100dvh]">
      <form
        className="container flex-grow py-5 flex flex-col gap-5"
        onSubmit={handleFormSubmission}
      >
        <TextField
          {...userData("email", {
            required: true,
            pattern: isEmail,
          })}
          placeholder="Електронная почта"
        />
        <TextField
          {...userData("name", { required: true })}
          placeholder="Имя"
        />
        <TextField
          {...userData("surname", { required: true })}
          placeholder="Фамилия"
        />
        <TextField
          {...userData("phone", { required: true })}
          placeholder="Телефон"
        />
      </form>
      <form
        id="password"
        className="container flex-grow flex flex-col gap-5"
        onSubmit={handleSubmitPassword((data) => updatePassword(data))}
      >
        <span className="text-2xl font-bold">Обновить пароль</span>
        <TextField
          {...userPassword("password", { required: true })}
          placeholder="Пароль"
          type="password"
        />
        {isDirtyUserPassword && <Button title="Обновить" form="password" />}
      </form>
      <BottomPanel
        doneFunc={isDirtyUserData ? handleFormSubmission : undefined}
      />
    </div>
  );
};

export { ProfileSettings };

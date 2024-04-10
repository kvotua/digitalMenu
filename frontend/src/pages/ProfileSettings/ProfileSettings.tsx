import { useForm } from "react-hook-form";
import { IUser } from "src/app/Types/user.type";
import { useAppSelector } from "src/app/hooks/useAppSelector";
import UserService from "src/app/services/UserService";
import { TextField } from "src/shared/TextField/TextField";
import { BottomPanel } from "src/widgets/BottomPanel/BottomPanel";

const ProfileSettings: React.FC = () => {
  const user = useAppSelector((state) => state.userSlice);
  const {
    register,
    formState: { isDirty },
    handleSubmit,
  } = useForm<Omit<IUser, "id" | "likes" | "username">>({
    values: {
      email: user.email ? user.email : "",
      name: user.name ? user.name : "",
      phone: user.phone ? user.phone : "",
      surname: user.surname ? user.surname : "",
    },
  });
  const { mutate } = UserService.updataUser();
  const onSubmit = (data: Omit<IUser, "id" | "likes" | "username">) => {
    // mutate(data);
    console.log(data);
  };
  const handleFormSubmission = () => {
    handleSubmit((data) => onSubmit(data))();
  };
  return (
    <div className="flex flex-col h-[100dvh]">
      <form
        className="container flex-grow py-5"
        onSubmit={handleFormSubmission}
      >
        <TextField {...register("email", { required: true })} />
        <TextField {...register("", { required: true })} />
        <TextField {...register("email", { required: true })} />
        <TextField {...register("email", { required: true })} />

      </form>
      <BottomPanel doneFunc={isDirty ? handleFormSubmission : undefined} />
    </div>
  );
};

export { ProfileSettings };

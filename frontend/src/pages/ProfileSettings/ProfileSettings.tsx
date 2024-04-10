import { useForm } from "react-hook-form";
import { useAppSelector } from "src/app/hooks/useAppSelector";
import { TextField } from "src/shared/TextField/TextField";
import { BottomPanel } from "src/widgets/BottomPanel/BottomPanel";

const ProfileSettings: React.FC = () => {
  const user = useAppSelector((state) => state.userSlice);
  const {
    register,
    formState: { isDirty },
  } = useForm({
    values: {
      login: user.username,
    },
  });

  return (
    <div className="flex flex-col h-[100dvh]">
      <main className="container flex-grow py-5">
        <TextField {...register("login", { required: true })} />
      </main>
      <BottomPanel doneFunc={isDirty ? () => {} : undefined} />
    </div>
  );
};

export { ProfileSettings };

import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import { setUser } from "src/app/Store/slices/userSlice";
import { useAppDispatch } from "src/app/hooks/useAppDispatch";
import { useAppSelector } from "src/app/hooks/useAppSelector";
import { Button } from "src/shared/Button/Button";
import { TextField } from "src/shared/TextField/TextField";
import { BottomPanel } from "src/widgets/BottomPanel/BottomPanel";

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const [token, setCookie] = useCookies(["userToken"]);
  console.log(token);
  const user = useAppSelector((state) => state.userSlice);
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-[100dvh]">
      <main className="container pt-5 flex-grow">
        <div className="py-5">
          <TextField
            value={user.username}
            disabled={true}
            className="disabled:opacity-100"
          />
        </div>
        <Button
          title="Выйти"
          handleClick={() => {
            dispatch(
              setUser({
                id: "",
                likes: { compositions: [], products: [] },
                username: "",
              })
            );
            setCookie("userToken", "", { maxAge: 1000 * 60 * 60 * 24 * 30 });
            navigate("/");
          }}
        />
      </main>
      <BottomPanel />
    </div>
  );
};

export { Profile };

import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import { setUser } from "src/app/Store/slices/userSlice";
import { useAppDispatch } from "src/app/hooks/useAppDispatch";
import { useAppSelector } from "src/app/hooks/useAppSelector";
import { Button } from "src/shared/Button/Button";
import { Field } from "src/shared/Field/Field";
import { BottomPanel } from "src/widgets/BottomPanel/BottomPanel";

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const [token, setCookie] = useCookies(["userToken"]);
  token;
  const user = useAppSelector((state) => state.userSlice);
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-[100dvh]">
      <main className="container pt-5 flex-grow">
        <div className="py-5 flex flex-col gap-5">
          {user.username && <Field text={user.username} title={"Логин"} />}
          {user.name && <Field text={user.name} title={"Имя"} />}
          {user.surname && <Field text={user.surname} title={"Фамилия"} />}
          {user.phone && <Field text={user.phone} title={"Телефон "} />}
          {user.email && <Field text={user.email} title={"Почта"} />}
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

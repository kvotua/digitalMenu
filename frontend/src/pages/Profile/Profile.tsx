import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import { setUser } from "src/app/Store/slices/userSlice";
import { useAppDispatch } from "src/app/hooks/useAppDispatch";

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const [token, setCookie] = useCookies(["userToken"]);
  console.log(token);

  const navigate = useNavigate();
  return (
    <main className="container pt-5">
      <button
        className="px-5 py-3 bg-black rounded-2xl text-white"
        onClick={() => {
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
      >
        Выйти
      </button>
    </main>
  );
};

export { Profile };

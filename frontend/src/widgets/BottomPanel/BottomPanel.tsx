import { useNavigate } from "react-router-dom";
import style from "./BottomPanel.module.scss";
import { IButtonPanelProps } from "./BottonPanel.model";
import { BounceLoader } from "react-spinners";

const BottomPanel: React.FC<IButtonPanelProps> = ({
  deleteFunc,
  doneFunc,
  disabled,
  isValid,
  form,
}) => {
  const navigate = useNavigate();
  return (
    <div className={`${style.panel__container} py-5 z-50`}>
      <img
        src="/arrowBack.svg"
        onClick={() => navigate(-1)}
        className=" w-6 justify-items-start"
      />
      {disabled ? (
        <BounceLoader className="justify-self-end" size={30} color="#ae88f1" />
      ) : (
        <button form={form} className="justify-self-end">
          {isValid && (
            <img src="/done.svg" onClick={doneFunc} className="w-6 " />
          )}
        </button>
      )}

      {deleteFunc && !disabled && (
        <img
          src="/trash1.svg"
          onClick={deleteFunc}
          className="w-6 col-span-2 justify-self-center"
        />
      )}
    </div>
  );
};

export { BottomPanel };

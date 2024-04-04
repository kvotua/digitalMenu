import { useNavigate } from "react-router-dom";
import style from "./BottomPanel.module.scss";
import { IButtonPanelProps } from "./BottonPanel.model";

const BottomPanel: React.FC<IButtonPanelProps> = ({
  deleteFunc = () => {},
  doneFunc = () => {},
}) => {
  const navigate = useNavigate();
  return (
    <div className={style.panel__container}>
      <img
        src="/arrowBack.svg"
        onClick={() => navigate(-1)}
        className=" w-6 justify-items-start"
      />
      {deleteFunc && (
        <img
          src="/done.svg"
          onClick={deleteFunc}
          className="w-6 justify-self-end"
        />
      )}
      {doneFunc && (
        <img
          src="/trash.svg"
          onClick={doneFunc}
          className="w-6 col-span-2 justify-self-center"
        />
      )}
    </div>
  );
};

export { BottomPanel };

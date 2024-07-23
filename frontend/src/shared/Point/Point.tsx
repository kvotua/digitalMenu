import Clear from "../../../public/trash1.svg";
import "./Point.scss";

const Point: React.FC<{
  deleteFunc?: (() => void) | undefined;
  disabled?: boolean;
  setActivePoint?: () => void;
  product_id?: string;
  activePoint?: string;
  x: number;
  y: number;
}> = ({ setActivePoint, deleteFunc, product_id, activePoint, x = 0, y = 0 }) => {


  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (setActivePoint){
          setActivePoint();
        }
      }}
      id={product_id}
      //   key={product_id}
      className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full z-[10] flex justify-center items-center`}
      style={{
        top: y,
        left: x,
      }}
    >
      <div
        className={`w-3 h-3  rounded-full  ${
          product_id === activePoint ? "bg-[#ae88f1]" : "bg-white"
        } `}
      >
        {product_id === activePoint && (
        <>
        
        <div onClick={deleteFunc} className="clear">
          <img src={Clear} alt="clear" />
        </div>
        </>
        
      )}
      </div>
    </div>
  );
};

export { Point };

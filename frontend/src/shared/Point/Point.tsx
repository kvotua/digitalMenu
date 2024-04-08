const Point: React.FC<{
  setActivePoint?: () => void;
  product_id?: string;
  activePoint?: string;
  x: number;
  y: number;
}> = ({ setActivePoint, product_id, activePoint, x = 0, y = 0 }) => {
  return (
    <div
      onClick={setActivePoint}
      id={product_id}
      //   key={product_id}
      className={`absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full z-50 flex justify-center items-center ${
        product_id === activePoint ? "bg-red-500" : ""
      }`}
      style={{
        top: y,
        left: x,
      }}
    >
      <div className={`w-1/2 h-1/2 bg-white rounded-full `}></div>
    </div>
  );
};

export { Point };

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { apiWithAuth } from "src/app/Http";
import { IComposition } from "src/app/Types/composition.type";
import { useGetProductById } from "src/app/services/useGetProductById";
import { useGetProduct } from "src/app/services/useGetProducts";
import { Point } from "src/shared/Point/Point";
import { BottomPanel } from "src/widgets/BottomPanel/BottomPanel";
import Heart from "src/app/assets/heart.svg?react";

const Composition: React.FC = () => {
  const { id } = useParams();
  const { data: composition, refetch } = useQuery({
    queryKey: "getComposition",
    queryFn: () =>
      apiWithAuth
        .get<IComposition>(`/compositions/${id}`)
        .then(({ data }) => data),
  });
  const { data: products } = useGetProduct();
  const [activePoint, setActivePoint] = useState<string>("");
  const [point, setPoint] = useState({
    x: 0,
    y: 0,
  });
  const [product, setProduct] = useState("");
  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationKey: "deleteComp",

    mutationFn: () => apiWithAuth.delete(`compositions/${id}`),
    onSuccess: () => navigate(-1),
  });
  const [rect, setRect] = useState({
    width: 0,
    height: 0,
  });
  const img = useRef<HTMLImageElement>(null);
  const [isLoading, setIsImgLoading] = useState(true);
  useEffect(() => {
    const current = img.current;
    setPoint;
    if (current) {
      setRect({
        width: current.clientWidth,
        height: current.clientHeight,
      });
    }
  }, [isLoading]);
  const { mutate: addPoint } = useMutation({
    mutationKey: "addPoint",
    mutationFn: () => {
      if (img.current) {
        return apiWithAuth.post(`/compositions/${id}/product`, {
          product_id: product,
          x: point.x / img.current?.clientWidth,
          y: point.y / img.current?.clientHeight,
        });
      }
      return Promise.resolve(null);
    },
    onSuccess: () => navigate(-1),
  });

  const { data: currentProduct } = useGetProductById(activePoint);
  const { mutate: deletePoint } = useMutation({
    mutationKey: "deletePoint",
    mutationFn: () =>
      apiWithAuth.delete(`/compositions/${id}/product/${activePoint}`),
    onSuccess: () => refetch(),
  });
  const [like, setLike] = useState(false);
  return (
    <main className="container pt-5 flex flex-col min-h-screen">
      <div className=" flex-grow ">
        <div
          className="w-full relative border rounded-2xl border-[#ae88f1] p-2"
          id="container"
          onClick={(e) => {
            if (e.currentTarget.id === "container") {
              setPoint({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
            }
            console.log(e.currentTarget.children);
          }}
        >
          {!isLoading &&
            composition?.points.map(({ x, y, product_id }) => (
              <Point
                setActivePoint={() => setActivePoint(product_id)}
                product_id={product_id}
                activePoint={activePoint}
                x={x * rect.width}
                key={product_id}
                y={y * rect.height}
              />
            ))}
          {(point.x !== 0 || point.y !== 0) && (
            <Point
              activePoint={activePoint}
              product_id={""}
              x={point.x}
              y={point.y}
            />
          )}
          <Heart
            id="like"
            fill={like ? "#ff5959" : "#ae88f1"}
            className="absolute top-5 right-5 w-10 h-10 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setLike(!like);
            }}
          />
          <img
            ref={img}
            src={`${import.meta.env.VITE_API_URL}/compositions/${
              composition?.id
            }/image`}
            alt="image"
            className="rounded-2xl w-full"
            onLoad={() => setIsImgLoading(false)}
          />
        </div>
        {point.x !== 0 && (
          <>
            <span className="font-bold">Добавьте продукт к композиции</span>
            <select
              onChange={(e) => setProduct(e.target.value)}
              className={`appearance-none bg-white p-5 outline-none border border-[#ae88f1] rounded-2xl relative overflow-visible w-full mt-5`}
            >
              <option value="0">Выберите продукт</option>
              {products
                ?.filter((product) => {
                  const bools = composition?.points.map(
                    ({ product_id }) => product.id === product_id
                  );
                  return !bools?.includes(true);
                })
                .map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
            </select>
          </>
        )}
      </div>
      {currentProduct && (
        <div className="grid grid-cols-2 pt-5 gap-5 pb-20">
          <img
            src={`${import.meta.env.VITE_API_URL}/products/${
              currentProduct?.id
            }/image`}
            alt=""
          />
          <div className="flex flex-col text-2xl font-bold">
            <span>{currentProduct?.name}</span>
            <span>{currentProduct?.price} p.</span>
          </div>

          <p className="col-span-2">{currentProduct?.description}</p>
        </div>
      )}
      <BottomPanel
        deleteFunc={activePoint ? deletePoint : mutate}
        doneFunc={addPoint}
      />
    </main>
  );
};

export { Composition };

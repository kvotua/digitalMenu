import { useEffect, useId, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { apiWithAuth } from "src/app/Http";
import { IComposition } from "src/app/Types/composition.type";
import { useGetProductById } from "src/app/services/useGetProductById";
import { useGetProduct } from "src/app/services/useGetProducts";
import { Product } from "src/entities/Product/Product";
import { Point } from "src/shared/Point/Point";
import { BottomPanel } from "src/widgets/BottomPanel/BottomPanel";

const Composition: React.FC = () => {
  const { id } = useParams();
  const isAdmin = true;
  const { data: composition } = useQuery({
    queryKey: "getComposition",
    queryFn: () =>
      apiWithAuth
        .get<IComposition>(`/compositions/${id}`)
        .then(({ data }) => data),
  });
  const { data: products } = useGetProduct();
  const [activePoint, setActivePoint] = useState<string>("");
  // const [isImgLoading, setIsImgLoading] = useState(true);
  // const { data: product } = useGetProductById(activePoint);
  // const container = useRef<HTMLImageElement>(null);
  // useEffect(() => {
  //   const divContainer = container.current;
  //   if (divContainer && !isImgLoading) {
  //     const rect = divContainer.getBoundingClientRect();
  //   }
  // }, [composition, isImgLoading]);
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
  const newPoint = useRef(null);

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
  const {} = useMutation({
    mutationKey: "deletePoint",
    mutationFn: () =>
      apiWithAuth.delete(`/compositions/${id}/product`, {
        product_id: activePoint,
      }),
  });
  return (
    <main className="container pt-5 flex flex-col min-h-screen">
      <div className=" flex-grow">
        <div
          className="w-full relative"
          id="container"
          onClick={(e) => {
            if (e.currentTarget.id === "container") {
              setPoint({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
            }
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
          <Point
            activePoint={activePoint}
            product_id={""}
            x={point.x}
            y={point.y}
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

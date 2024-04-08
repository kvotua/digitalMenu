import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { apiWithAuth } from "src/app/Http";
import { IComposition } from "src/app/Types/composition.type";
import { useGetProductById } from "src/app/services/useGetProductById";
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
  // const [activePoint, setActivePoint] = useState<string>("");
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
  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationKey: "deleteComp",

    mutationFn: () => apiWithAuth.delete(`compositions/${id}`),
    onSuccess: () => navigate(-1),
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
          <Point x={point.x} y={point.y} />
          <img
            // ref={container}
            src={`${import.meta.env.VITE_API_URL}/compositions/${
              composition?.id
            }/image`}
            alt="image"
            className="rounded-2xl w-full"
            // onLoad={() => setIsImgLoading(false)}
          />
        </div>
        {point.x !== 0 && (
          <>
            <span className="font-bold">Добавьте продукт к композиции</span>
            <select
              className={`appearance-none bg-white p-5 outline-none border border-[#ae88f1] rounded-2xl relative overflow-visible w-full mt-5`}
            >
              <option value="0">Выберите категорию</option>
              <option key={"123"} value={"123"}>
                12
              </option>
            </select>
          </>
        )}
      </div>
      {/* {!isAdmin && product && (
        <div className="grid grid-cols-2 pt-5 gap-5 pb-20">
          <img
            src={`${import.meta.env.VITE_API_URL}/products/${
              product?.id
            }/image`}
            alt=""
          />
          <div className="flex flex-col text-2xl font-bold">
            <span>{product?.name}</span>
            <span>{product?.price} p.</span>
          </div>

          <p className="col-span-2">{product?.description}</p>
        </div>
      )} */}
      {/* <Product /> */}
      <BottomPanel deleteFunc={mutate} />
    </main>
  );
};

export { Composition };

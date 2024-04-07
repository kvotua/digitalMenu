import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { apiWithAuth } from "src/app/Http";
import { IComposition } from "src/app/Types/composition.type";
import { useGetProductById } from "src/app/services/useGetProductById";
import { Product } from "src/entities/Product/Product";
import { BottomPanel } from "src/widgets/BottomPanel/BottomPanel";

const Composition: React.FC = () => {
  const { id } = useParams();
  const { data: composition } = useQuery({
    queryKey: "getComposition",
    queryFn: () =>
      apiWithAuth
        .get<IComposition>(`/compositions/${id}`)
        .then(({ data }) => data),
  });
  const [activePoint, setActivePoint] = useState<null | string>(null);
  const [rect, setRect] = useState<DOMRect>();
  const [isImgLoading, setIsImgLoading] = useState(true);
  const { data: product } = useGetProductById(activePoint);
  const container = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const divContainer = container.current;
    if (divContainer && !isImgLoading) {
      const rect = divContainer.getBoundingClientRect();
      console.log(rect);

      setRect(rect);
    }
  }, [composition, isImgLoading]);
  console.log(product);

  return (
    <main className="container pt-5">
      <div className="w-full relative">
        {composition &&
          composition?.points?.map(({ product_id, x, y }) => (
            <div
              onClick={() => setActivePoint(product_id)}
              id={product_id}
              key={product_id}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full z-50 flex justify-center items-center"
              style={{
                top: !isImgLoading && rect ? y * rect?.height : 0,
                left: !isImgLoading && rect ? x * rect?.width : 0,
              }}
            >
              <div
                className={`w-1/2 h-1/2 bg-white rounded-full ${
                  product_id === activePoint ? "bg-green-500" : ""
                }`}
              ></div>
            </div>
          ))}
        <img
          ref={container}
          src={`${import.meta.env.VITE_API_URL}/compositions/${
            composition?.id
          }/image`}
          alt="image"
          className="rounded-2xl w-full"
          onLoad={() => setIsImgLoading(false)}
        />
      </div>
      {product && (
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
      )}
      <Product />
      <BottomPanel />
    </main>
  );
};

export { Composition };

import { useState } from "react";
import { useGetTags } from "src/app/services/useGetTags";
import style from "./CompositionAdd.module.scss";
import { useGetProduct } from "src/app/services/useGetProducts";
import { BottomPanel } from "src/widgets/BottomPanel/BottomPanel";
import { useMutation } from "react-query";
import { apiWithAuth } from "src/app/Http";
const CompositionAdd: React.FC = () => {
  const [img, setImg] = useState<null | File>(null);
  const formData = new FormData();
  if (img) {
    formData.append("image", img);
  }
  const { data: tags } = useGetTags();
  const { data: products } = useGetProduct();
  const [pointIndex, setPointIndex] = useState(-1);
  const [points, setPoints] = useState<
    {
      x: number;
      y: number;
      relX: number;
      relY: number;
      product: string;
    }[]
  >([]);
  const [tag, setTeg] = useState("");

  const [product, setProduct] = useState("");
  const { mutate } = useMutation({
    mutationKey: "postComposition",
    mutationFn: async () =>
      apiWithAuth.post("/compositions/", {
        points: points.map((point) => ({
          product_id: point.product,
          x: point.relX,
          y: point.relY,
        })),
        tags: [tag],
      }),
    onSuccess: ({ data }) =>
      apiWithAuth.post(`/compositions/${data}/image`, formData),
  });

  return (
    <main className="container pt-5">
      <h2 className="text-2xl text-center font-bold pb-5">
        Создать композицию
      </h2>
      <label htmlFor="image">
        {!img && (
          <input
            type="file"
            id="image"
            className="hidden"
            onChange={(e) => setImg(e.target.files && e.target.files[0])}
          />
        )}

        <div
          id="photo"
          className="w-full min-h-80 border border-[#ae88f1] flex items-center justify-center rounded-2xl relative"
          onClick={(e) => {
            if (points.length < 5) {
              if (e.currentTarget.id === "photo") {
                if (img) {
                  setPointIndex(pointIndex + 1);
                  const newPoint = {
                    x: e.nativeEvent.offsetX,
                    y: e.nativeEvent.offsetY,
                    relX: e.nativeEvent.offsetX / e.currentTarget.clientWidth,
                    relY: e.nativeEvent.offsetY / e.currentTarget.clientHeight,
                    product: product,
                  };
                  setPoints([...points, newPoint]);
                }
              }
            }
          }}
        >
          {img &&
            points.map(({ x, y }, i) => (
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full z-50 flex justify-center items-center"
                style={{ top: y, left: x }}
                onClick={(e) => {
                  e.stopPropagation();
                  setPointIndex(i);
                }}
              >
                <div
                  className={`w-1/2 h-1/2 rounded-full bg-white ${
                    pointIndex === i ? "bg-green-500" : ""
                  }`}
                ></div>
              </div>
            ))}
          {img && (
            <img
              src={URL.createObjectURL(img)}
              alt="photo"
              className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
            />
          )}
          {!img && "Загрузить изображение"}
          {img && (
            <span className="relative z-50 text-white font-bold">
              Добавьте точку
            </span>
          )}
        </div>
      </label>
      <div className="appearance-none pt-5 pb-20 flex flex-col gap-5 ">
        <span className="font-bold">Добавьте категорию к композиции</span>
        <select
          onChange={(e) => setTeg(e.target.value)}
          className={`${style.drop_container}`}
        >
          <option value="0">Выберите категорию</option>
          {tags?.map(({ name, id }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
        {pointIndex !== -1 && points[pointIndex].x !== 0 && (
          <>
            <span className="font-bold">Добавьте продукт</span>
            <select
              onChange={(e) => {
                setPoints(
                  points.map((point, index) => {
                    if (index === pointIndex) {
                      return {
                        ...point,
                        product: e.target.value, // Обновляем продукт для выбранной точки
                      };
                    }
                    return point;
                  })
                );
                setProduct(e.target.value);
              }}
              className={`${style.drop_container}`}
            >
              <option value="0">Выберите продукт</option>
              {products?.map(({ name, id }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </>
        )}
      </div>
      <BottomPanel doneFunc={mutate} />
    </main>
  );
};

export { CompositionAdd };

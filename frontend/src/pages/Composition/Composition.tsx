import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";

import { apiWithAuth } from "src/app/Http";
import { IComposition } from "src/app/Types/composition.type";
import { useGetProduct } from "src/app/services/useGetProducts";
import { Point } from "src/shared/Point/Point";
import { BottomPanel } from "src/widgets/BottomPanel/BottomPanel";
import Heart from "src/app/assets/heart.svg?react";
import Share from "src/app/assets/share.svg?react";
import { useAppSelector } from "src/app/hooks/useAppSelector";
import Cart from "src/app/assets/cart.svg?react";
import { IProduct } from "src/app/Types/product.type";

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
  const likes = useAppSelector((state) => state.userSlice.likes);
  const [like, setLike] = useState(false);
  useEffect(() => {
    const current = img.current;
    setPoint;
    if (current) {
      setRect({
        width: current.clientWidth,
        height: current.clientHeight,
      });
    }
    if (likes) {
      setLike(likes?.compositions.includes(id!));
    }
  }, [isLoading, likes]);
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

  const { data: currentProduct } = useQuery({
    queryKey: ["getProductById", activePoint],
    queryFn: () =>
      id
        ? apiWithAuth
            .get<IProduct>(`/products/${activePoint}`)
            .then(({ data }) => data)
        : Promise.resolve(null),
    onSuccess: () => reset(),
  });
  const { mutate: deletePoint } = useMutation({
    mutationKey: "deletePoint",
    mutationFn: () =>
      apiWithAuth.delete(`/compositions/${id}/product/${activePoint}`),
    onSuccess: () => refetch(),
  });

  const queryClient = useQueryClient();
  const { mutate: addLike } = useMutation({
    mutationKey: "addLike",
    mutationFn: () => apiWithAuth.post(`/compositions/${id}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries("getComposition");
      queryClient.invalidateQueries("getUser");
    },
  });
  const { mutate: deleteLike } = useMutation({
    mutationKey: "deleteLike",
    mutationFn: () => apiWithAuth.delete(`/compositions/${id}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries("getComposition");
      queryClient.invalidateQueries("getUser");
    },
  });
  const userName = useAppSelector((state) => state.userSlice.username);
  const shareData = {
    title: "preview",
    url: window.location.href,
  };

  const {
    mutate: addToCart,
    isSuccess,
    reset,
  } = useMutation({
    mutationKey: "addToCart",
    mutationFn: (id: string) => apiWithAuth.post(`products/${id}/cart`),
    onSuccess: () => queryClient.invalidateQueries("getUser"),
  });

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
          {userName === "admin" && (point.x !== 0 || point.y !== 0) && (
            <Point
              activePoint={activePoint}
              product_id={""}
              x={point.x}
              y={point.y}
            />
          )}
          <div
            className="flex items-center justify-center absolute bottom-5 right-5  bg-white rounded-full border border-[#ae88f1] px-2"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-3xl">{composition?.likes}</span>
            <Heart
              id="like"
              fill={like ? "red" : "none"}
              stroke={like ? "none" : "black"}
              strokeWidth={2}
              className={`w-10 h-10  flex justify-center items-center p-1`}
              onClick={() => {
                if (!like) {
                  addLike();
                } else {
                  deleteLike();
                }
                setLike(!like);
              }}
            />
            <Share
              className="w-10 h-10 fill-none stroke-black stroke-2"
              onClick={() => {
                if (navigator.share && navigator.canShare(shareData)) {
                  navigator.share(shareData);
                }
              }}
            />
          </div>
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
        {userName === "admin" && point.x !== 0 && (
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
        {activePoint && (
          <div className="grid grid-cols-2 pt-5 gap-5 pb-20">
            <div className="relative">
              {isSuccess ? (
                <img
                  src="/check.svg"
                  alt="check"
                  className="w-10 h-10 items-end bg-[#ae88f1] stroke-white rounded-2xl p-2 absolute -top-2 -right-2"
                />
              ) : (
                <Cart
                  className="w-10 h-10 items-end bg-[#ae88f1] stroke-white rounded-2xl p-2 absolute -top-2 -right-2"
                  onClick={() => {
                    addToCart(activePoint);
                  }}
                />
              )}
              <img
                src={`${import.meta.env.VITE_API_URL}/products/${
                  currentProduct?.id
                }/image`}
                alt=""
                className="rounded-2xl"
              />
            </div>
            <div className="flex flex-col text-2xl font-bold">
              <span>{currentProduct?.name}</span>
              <span>{currentProduct?.price} p.</span>
            </div>

            <p className="col-span-2">{currentProduct?.description}</p>
          </div>
        )}
      </div>
      <BottomPanel
        deleteFunc={
          userName === "admin"
            ? activePoint
              ? deletePoint
              : mutate
            : undefined
        }
        doneFunc={userName === "admin" ? addPoint : undefined}
      />
    </main>
  );
};

export { Composition };

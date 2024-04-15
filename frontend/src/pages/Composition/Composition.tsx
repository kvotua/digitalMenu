import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";

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
import { Button } from "src/shared/Button/Button";
import { Autocomplete, TextField } from "@mui/material";

const Composition: React.FC = () => {
  const { id } = useParams();
  const { data: composition, refetch } = useQuery({
    queryKey: "getComposition",
    queryFn: () =>
      apiWithAuth
        .get<IComposition>(`/compositions/${id}`)
        .then(({ data }) => data),
  });
  const { data: products = [] } = useGetProduct();
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
    onSuccess: () => window.location.reload(),
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
  const { mutate: deleteProductFromCart, isSuccess: successDeleteProduct } =
    useMutation({
      mutationKey: "deleteProductFromCart",
      mutationFn: (id: string) => apiWithAuth.delete(`/products/${id}/cart`),
      onSuccess: () => queryClient.invalidateQueries("getUser"),
    });

  return (
    <main className="container pt-5 flex flex-col min-h-screen">
      <div className="flex-grow">
        <div
          className="w-full relative rounded-2xl p-2 min-h-20"
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
            style={{ zIndex: 1 }}
            className="flex items-center justify-center absolute bottom-5 right-5 rounded-full border border-[#ae88f1] bg-[#ae88f1] px-5 "
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-2xl text-white ">{composition?.likes}</span>
            <Heart
              style={{ zIndex: 1 }}
              id="like"
              fill={like ? "red" : "white"}
              stroke={like ? "none" : "white"}
              strokeWidth={2}
              className={`w-8 h-8  flex justify-center items-center p-1`}
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
              style={{ zIndex: 1 }}
              fill={"white"}
              className="w-7 *: h-7 stroke-white stroke-2"
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
            <br />
            <span className="font-bold gap-5">
              Добавьте продукт к композиции
            </span>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={
                products
                  ? products
                      ?.filter((product) => {
                        const bools = composition?.points.map(
                          ({ product_id }) => product.id === product_id
                        );
                        return !bools?.includes(true);
                      })
                      .map((product) => {
                        return {
                          label: product.name,
                          id: product.id,
                        };
                      })
                  : []
              }
              onChange={(e, newValue) => {
                if (newValue) {
                  setProduct(newValue?.id);
                  // queryClient.invalidateQueries("getComposition");
                }
              }}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Movie" />}
            />
            <Link to={"/add/product"} className="block pt-5">
              <Button title="Создать новый" />
            </Link>
          </>
        )}
        {activePoint && (
          <div className="grid grid-cols-2 pt-5 gap-5 relative">
            <img
              src={`${import.meta.env.VITE_API_URL}/products/${
                currentProduct?.id
              }/image`}
              alt=""
              className="rounded-2xl"
            />

            <div className="flex flex-col font-bold justify-between">
              <span>{currentProduct?.name}</span>
              <p className="col-span-2 relative break-words font-light overflow-scroll w-3/4">
                {currentProduct?.description}
              </p>
              <span>{currentProduct?.price} p.</span>
            </div>

            {isSuccess && !successDeleteProduct ? (
              <img
                src="/check.svg"
                alt="check"
                className="w-10 h-10 items-end bg-[#ae88f1] rounded-full p-2 absolute bottom-0 -right-1"
                onClick={() => deleteProductFromCart(activePoint)}
              />
            ) : (
              <Cart
                style={{ zIndex: 1 }}
                className="w-10 h-10 items-end bg-[#ae88f1] stroke-white rounded-full p-2 absolute bottom-0 -right-1"
                onClick={() => {
                  addToCart(activePoint);
                }}
              />
            )}
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

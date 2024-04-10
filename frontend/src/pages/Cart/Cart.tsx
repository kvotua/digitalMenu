import { useMutation, useQuery, useQueryClient } from "react-query";
import { apiWithAuth } from "src/app/Http";
import { IProduct } from "src/app/Types/product.type";
import { useAppSelector } from "src/app/hooks/useAppSelector";
import { Button } from "src/shared/Button/Button";
import { BottomPanel } from "src/widgets/BottomPanel/BottomPanel";

const Cart: React.FC = () => {
  const cart = useAppSelector((state) => state.userSlice.cart);
  const { data } = useQuery({
    queryKey: ["getCart", cart],
    queryFn: () => {
      if (cart) {
        return Promise.all(
          Object.keys(cart).map((item) => {
            return apiWithAuth
              .get<IProduct>(`/products/${item}`)
              .then(({ data }) => data);
          })
        );
      } else {
        return Promise.resolve(null);
      }
    },
  });
  const queryClient = useQueryClient();
  const { mutate: deleteProductFromCart } = useMutation({
    mutationKey: "deleteProductFromCart",
    mutationFn: (id: string) => apiWithAuth.delete(`/products/${id}/cart`),
    onSuccess: () => queryClient.invalidateQueries("getUser"),
  });
  const { mutate: addToCart } = useMutation({
    mutationKey: "addToCart",
    mutationFn: (id: string) => apiWithAuth.post(`products/${id}/cart`),
    onSuccess: () => queryClient.invalidateQueries("getUser"),
  });

  let totalPrice = 0;
  data?.forEach((product) => {
    if (cart && product.id in cart) {
      totalPrice += product.price * cart[product.id];
    }
  });

  return (
    <div className="flex flex-col h-[100dvh]">
      <main className="container pt-5 flex-grow flex flex-col gap-5">
        {data?.length === 0 ? (
          <div className="flex justify-center items-center h-full text-2xl font-bold">
            У вас нет продуктов
          </div>
        ) : (
          data?.map(({ name, id, price }, i) => (
            <div className="flex justify-between items-center" key={id}>
              <img
                src={`${import.meta.env.VITE_API_URL}/products/${id}/image`}
                alt={name}
                className="w-24 h-24 rounded-2xl object-cover"
              />
              <div className="flex flex-col items-center">
                <span className="font-bold text-xl ">
                  {name.length > 10 ? name.slice(0, 10) + "..." : name}
                </span>
                <span className="font-bold">
                  {cart ? cart[id] * price : ""} p.
                </span>
              </div>

              <div className=" border border-black/50 flex gap-5 p-2 rounded-2xl">
                <span
                  className="text-xl font-bold"
                  onClick={() => deleteProductFromCart(id)}
                >
                  -
                </span>
                <span className="text-xl">
                  {cart && Object.values(cart)[i]}
                </span>
                <span
                  className="text-xl font-bold"
                  onClick={() => addToCart(id)}
                >
                  +
                </span>
              </div>
            </div>
          ))
        )}
      </main>
      {data?.length !== 0 && (
        <div className="container flex flex-col gap-2">
          <span className="text-2xl font-bold">Итого: {totalPrice}</span>
          <Button title="Оформить заказ" />
        </div>
      )}
      <BottomPanel />
    </div>
  );
};

export { Cart };

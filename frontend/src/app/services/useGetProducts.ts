import { useQuery } from "react-query";
import { apiWithAuth } from "../Http";
import { Cookies } from "react-cookie";
import { IProduct } from "../Types/product.type";

const cookie = new Cookies();
export const useGetProduct = () => {
  return useQuery({
    queryKey: "getProduct",
    queryFn: async () =>
      apiWithAuth
        .get<IProduct[]>(`/products/`, {
          headers: {
            token: cookie.get("userToken"),
          },
        })
        .then(({ data }) => data),
  });
};

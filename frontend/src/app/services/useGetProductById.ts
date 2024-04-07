import { useQuery } from "react-query";
import { apiWithAuth } from "../Http";
import { IProduct } from "../Types/product.type";

export const useGetProductById = (id: string | null) => {
  return useQuery({
    queryKey: ["getProductById", id],
    queryFn: () =>
      id
        ? apiWithAuth.get<IProduct>(`/products/${id}`).then(({ data }) => data)
        : Promise.resolve(null),
  });
};

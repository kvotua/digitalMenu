import { useMutation } from "react-query";
import { apiWithAuth } from "../Http";

export const useGetProduct = () => {
  return useMutation({
    mutationKey: "getProduct",
    mutationFn: async (id: string) => apiWithAuth.get(`/products/${id}`),
  });
};

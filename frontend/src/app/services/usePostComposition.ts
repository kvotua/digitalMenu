import { useMutation } from "react-query";
import { apiWithAuth } from "../Http";

interface IPostComposition {
  points: [
    {
      product_id: string;
      x: number;
      y: number;
    }
  ];
  tags: string[];
}

export const usePostComposition = () => {
  return useMutation({
    mutationKey: "postComposition",
    mutationFn: async (body: IPostComposition) =>
      apiWithAuth.post("/compositions/", body),
  });
};

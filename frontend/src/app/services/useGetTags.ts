import { useQuery } from "react-query";
import { apiWithAuth } from "../Http";
import { ITag } from "../Types/tag.type";

export const useGetTags = () => {
  return useQuery({
    queryKey: "getTags",
    queryFn: async () => {
      return await apiWithAuth.get<ITag[]>("/tags/").then(({ data }) => data);
    },
  });
};

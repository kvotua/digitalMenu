import { useMutation, useQueryClient } from "react-query";
import { ITagProps } from "./Tag.model";
import style from "./Tag.module.scss";
import { apiWithAuth } from "src/app/Http";
import { useAppDispatch } from "src/app/hooks/useAppDispatch";
import { setFilter } from "src/app/Store/slices/filterSlice";
const Tag: React.FC<ITagProps> = ({ color, title, id, tagId, setTagId }) => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { mutate: deleteTag } = useMutation({
    mutationKey: "deleteTag",
    mutationFn: () => apiWithAuth.delete(`/tags/${tagId}`),
    onSuccess: () => {
      setTagId("0");
      dispatch(setFilter(""));
      queryClient.invalidateQueries("getTags");
    },
  });
  return (
    <div className={style.tags} onClick={() => setTagId(id)}>
      <div
        className={style.innerTags}
        style={{
          background: tagId === id ? "url(/smile.svg)" : color,
        }}
      >
        {tagId === id && tagId !== "0" && tagId !== "-1" && (
          <img
            src="/trash.svg"
            alt="trash"
            className="absolute w-6 -top-0 -right-0"
            onClick={() => deleteTag()}
          />
        )}
      </div>
      <span className={style.innerText}>
        {title.length > 6 ? title.slice(0, 6) + "..." : title}
      </span>
    </div>
  );
};

export { Tag };

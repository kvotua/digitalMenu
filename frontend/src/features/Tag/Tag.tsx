import { useMutation, useQueryClient } from "react-query";
import { ITagProps } from "./Tag.model";
import style from "./Tag.module.scss";
import { apiWithAuth } from "src/app/Http";
import { useAppDispatch } from "src/app/hooks/useAppDispatch";
import { setFilter } from "src/app/Store/slices/filterSlice";
import { useAppSelector } from "src/app/hooks/useAppSelector";
import "./Tag.css";
const Tag: React.FC<ITagProps> = ({
  color,
  title,
  id,
  tagId,
  setTagId,
  slice = true,
}) => {
  const userName = useAppSelector((state) => state.userSlice.username);

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
        {userName === "admin" &&
          tagId === id &&
          tagId !== "0" &&
          tagId !== "-1" && (
            <><div className="round_trash">
            <img
              src="/trash2.svg"
              alt="trash2"
              className="relative w-15 -bottom-0 -right-0 "
              onClick={() => deleteTag()}
            />
            </div></>
            
          )}
      </div>
      <span className={style.innerText}>
        {slice && title.length > 6 ? title.slice(0, 6) + "..." : title}
      </span>
    </div>
  );
};

export { Tag };

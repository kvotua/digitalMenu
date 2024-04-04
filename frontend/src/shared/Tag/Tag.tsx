import { ITagProps } from "./Tag.model";
import style from "./Tag.module.scss";
const Tag: React.FC<ITagProps> = ({ color, title, id, tagId, setTagId }) => {
  return (
    <div className={style.tags} onClick={setTagId}>
      <div
        className={style.innerTags}
        style={{
          background: tagId === id ? "url(/smile.svg)" : color,
        }}
      ></div>
      <span className={style.innerText}>
        {title.length > 6 ? title.slice(0, 6) + "..." : title}
      </span>
    </div>
  );
};

export { Tag };

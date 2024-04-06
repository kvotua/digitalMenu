import { useState } from "react";
import { useGetTags } from "src/app/services/useGetTags";
import { TextField } from "src/shared/TextField/TextField";
import style from "./CompositionAdd.module.scss";
const CompositionAdd: React.FC = () => {
  const [compositionInfo, setCompositionInfo] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [img, setImg] = useState<null | File>(null);
  const formData = new FormData();
  if (img) {
    formData.append("image", img);
  }
  const { data: tags } = useGetTags();
  return (
    <main className="container pt-5">
      <h2 className="text-2xl text-center font-bold pb-5">
        Создать композицию
      </h2>
      <label htmlFor="image">
        <input
          type="file"
          id="image"
          className="hidden"
          onChange={(e) => setImg(e.target.files && e.target.files[0])}
        />

        <div className="w-full min-h-80 border border-[#ae88f1] flex items-center justify-center rounded-2xl relative">
          {img && (
            <img
              src={URL.createObjectURL(img)}
              alt="photo"
              className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
            />
          )}
          Загрузить изображение
        </div>
      </label>
      <div className="appearance-none pt-5 pb-20 flex flex-col gap-5 ">
        <select className={`${style.drop_container}`}>
          <option value="0">Выберите категорию</option>
          {tags?.map(({ name, id }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
        <TextField
          value={compositionInfo.price}
          setValue={(e) =>
            setCompositionInfo({ ...compositionInfo, price: e.target.value })
          }
          placeholder="Цена"
          type="number"
        />
        <TextField
          value={compositionInfo.description}
          setValue={(e) =>
            setCompositionInfo({
              ...compositionInfo,
              description: e.target.value,
            })
          }
          placeholder="Описание"
          big
        />
      </div>
      {/* <BottomPanel doneFunc={mutate} /> */}
    </main>
  );
};

export { CompositionAdd };

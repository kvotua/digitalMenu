import { useState } from "react";
import { useGetTags } from "src/app/services/useGetTags";
import style from "./CompositionAdd.module.scss";
import { BottomPanel } from "src/widgets/BottomPanel/BottomPanel";
import { useMutation } from "react-query";
import { apiWithAuth } from "src/app/Http";
import { useNavigate } from "react-router-dom";
const CompositionAdd: React.FC = () => {
  const [img, setImg] = useState<null | File>(null);
  const formData = new FormData();
  if (img) {
    formData.append("image", img);
  }
  const { data: tags } = useGetTags();
  const [tag, setTeg] = useState<string[]>([]);
  console.log(tag);

  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationKey: "postComposition",
    mutationFn: async () => {
      const response = await apiWithAuth.post("/compositions/", {
        tags: tag,
      });
      if (response.status === 200) {
        return apiWithAuth
          .post(`/compositions/${response.data}/image`, formData)
          .then(() => navigate(-1));
      }
    },
  });

  return (
    <>
      <main className="container pt-5">
        <h2 className="text-2xl text-center font-bold pb-5">
          Создать композицию
        </h2>
        <label htmlFor="image">
          {!img && (
            <input
              type="file"
              id="image"
              className="hidden"
              onChange={(e) => setImg(e.target.files && e.target.files[0])}
            />
          )}
          <div
            id="photo"
            className="w-full min-h-80 border border-[#ae88f1] flex items-center justify-center rounded-2xl relative"
          >
            {img && (
              <img
                src={URL.createObjectURL(img)}
                alt="photo"
                className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
              />
            )}
            Загрузить фото
          </div>
        </label>
        <div className="appearance-none pt-5 pb-20 flex flex-col gap-5 ">
          <span className="font-bold">Добавьте категорию к композиции</span>
          <select
            multiple
            onChange={(e) => {
              setTeg(
                Array.from(e.target.selectedOptions).map(
                  (option) => option.value
                )
              );
            }}
            className={`${style.drop_container}`}
          >
            {tags?.map(({ name, id }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <BottomPanel doneFunc={mutate} disabled={isLoading} />
      </main>
    </>
  );
};

export { CompositionAdd };

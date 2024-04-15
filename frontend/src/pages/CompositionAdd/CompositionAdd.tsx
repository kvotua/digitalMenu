import { useState } from "react";
import { useGetTags } from "src/app/services/useGetTags";
import { BottomPanel } from "src/widgets/BottomPanel/BottomPanel";
import { useMutation } from "react-query";
import { apiWithAuth } from "src/app/Http";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { ITag } from "src/app/Types/tag.type";
const CompositionAdd: React.FC = () => {
  const [img, setImg] = useState<null | File>(null);
  const formData = new FormData();
  if (img) {
    formData.append("image", img);
  }
  const { data: allTags = [] } = useGetTags();
  const [choosenTags, setChoosenTag] = useState<ITag[]>([]);

  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationKey: "postComposition",
    mutationFn: async () => {
      const response = await apiWithAuth.post("/compositions/", {
        tags: choosenTags.map((tag) => tag.id),
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
            Загрузить фото (Максимум 2Мб.)
          </div>
        </label>
        <div className="appearance-none pt-5 pb-20 flex flex-col gap-5 ">
          <span className="font-bold">Добавьте категорию к композиции</span>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={choosenTags}
              // ===============================================================
              // WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING
              // ===============================================================
              // This code sucks, it works only with Gods help 🙏
              // TODO: refactor
              onChange={(event: SelectChangeEvent<typeof choosenTags>) => {
                const {
                  target: { value },
                } = event;
                if (typeof value === "string") return;
                const choosenTagId = value[value.length - 1];
                //@ts-expect-error, read above
                if (choosenTags.map((tag) => tag.id).includes(choosenTagId)) {
                  setChoosenTag(
                    //@ts-expect-error, read above
                    choosenTags.filter((tag) => tag.id !== choosenTagId)
                  );
                } else {
                  //@ts-expect-error, read above
                  const meow = allTags.filter((tag) => value.includes(tag.id));
                  setChoosenTag((prev) => [...prev, ...meow]);
                }
              }}
              // ===============================================================
              // WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING
              // ===============================================================
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected?.map((item) => (
                    <Chip key={item.id} label={item.name} />
                  ))}
                </Box>
              )}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 224,
                    width: 250,
                  },
                },
              }}
            >
              {allTags?.map((tag) => (
                <MenuItem key={tag.id} value={tag.id}>
                  {tag.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <BottomPanel doneFunc={mutate} disabled={isLoading} />
      </main>
    </>
  );
};

export { CompositionAdd };

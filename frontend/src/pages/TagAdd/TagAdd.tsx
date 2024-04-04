import { useState } from "react";
import { useMutation } from "react-query";
import { apiWithAuth } from "src/app/Http";
import { TextField } from "src/shared/TextField/TextField";
import { BottomPanel } from "src/widgets/BottomPanel/BottomPanel";
import ColorPicker from "src/app/assets/ColorPicker.svg?react";

const TagAdd: React.FC = () => {
  const [tagInfo, setTagInfo] = useState({
    name: "",
    color: "#000",
  });
  const { mutate } = useMutation({
    mutationKey: "addTag",
    mutationFn: async () => {
      return apiWithAuth.post("/tags/", tagInfo);
    },
  });
  return (
    <main className="container pt-5">
      <h2 className="pb-2 pl-1">Название и цвет раздела</h2>
      <div className="flex gap-5 items-center">
        <TextField
          value={tagInfo.name}
          setValue={(e) => setTagInfo({ ...tagInfo, name: e.target.value })}
        />
        <label htmlFor="color">
          <input
            onChange={(e) => setTagInfo({ ...tagInfo, color: e.target.value })}
            type="color"
            id="color"
            className="hidden"
          />
          <div
            className="w-16 h-16 rounded-full border flex justify-center items-center"
          >
            <ColorPicker width="30px" fill={tagInfo.color} />
          </div>
        </label>
      </div>
      <BottomPanel doneFunc={mutate} />
    </main>
  );
};

export { TagAdd };

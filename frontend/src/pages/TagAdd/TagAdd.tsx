import { useState } from "react";
import { useMutation } from "react-query";
import { apiWithAuth } from "src/app/Http";
import { TextField } from "src/shared/TextField/TextField";
import { BottomPanel } from "src/widgets/BottomPanel/BottomPanel";
import { useNavigate } from "react-router-dom";

const TagAdd: React.FC = () => {
  const [tagInfo, setTagInfo] = useState({
    name: "",
    color: "",
  });
  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationKey: "addTag",
    mutationFn: async () => {
      return apiWithAuth.post("/tags/", tagInfo);
    },
    onSuccess: () => navigate(-1),
  });
  return (
    <main className="container pt-5 flex flex-col h-screen">
      <div className="flex-grow">
        <h2 className="pb-2 pl-1">Название и цвет раздела</h2>
        <div className="flex gap-5 items-center ">
          <TextField
            value={tagInfo.name}
            setValue={(e) => setTagInfo({ ...tagInfo, name: e.target.value })}
          />
          <label htmlFor="color">
            <input
              onChange={(e) =>
                setTagInfo({ ...tagInfo, color: e.target.value })
              }
              type="color"
              id="color"
              className="w-0 h-0 absolute opacity-0"
            />
            <div
              className="w-16 h-16 rounded-full border border-[#ae88f1] flex justify-center items-center"
              style={{ background: tagInfo.color }}
            >
              {/* {tagInfo.color ? null : ( */}
                <img src="/ColorPicker.svg" alt="color picker" className="w-10 rounded-full" />
              {/* )} */}
            </div>
          </label>
        </div>
      </div>

      <BottomPanel doneFunc={mutate} />
    </main>
  );
};

export { TagAdd };

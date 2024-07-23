import { useMutation } from "react-query";
import { apiWithAuth } from "src/app/Http";
import { TextField } from "src/shared/TextField/TextField";
import { BottomPanel } from "src/widgets/BottomPanel/BottomPanel";
import { useNavigate } from "react-router-dom";
import React from "react";
import ColorPicker from "./Color";
import { useForm } from "react-hook-form";

const TagAdd: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    values: {
      name: "",
      color: "",
    },
  });
  
  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationKey: "addTag",
    mutationFn: async (data: { name: string; color: string }) => {
      return apiWithAuth.post("/tags/", data);
    },
    onSuccess: () => navigate(-1),
  });
  return (
    <main className="container pt-5 flex flex-col h-screen">
      <form
        onSubmit={handleSubmit((data) => mutate(data))}
        id="tag"
        className="flex-grow"
      >
        <h2 className="pb-2 pl-1">Название и цвет раздела</h2>
        <div className="flex gap-3 items-center ">
          <TextField
            placeholder="Введите название раздела"
            {...register("name", { required: "Имя раздела обязательно" })}
            errorMessage={errors.name?.message}
          />
        </div>
        <br /> <br />
        <div className="flex justify-center ">

        {/* <label htmlFor="color">
          <ColorPicker controller={control} {...register("color", { required: true })} />
        </label> */}
        
        </div>
        <br />
        <br />
        {/* <Component /> */}
      </form>

      <BottomPanel form="tag" isValid={isValid} />
    </main>
  );
};

export { TagAdd };

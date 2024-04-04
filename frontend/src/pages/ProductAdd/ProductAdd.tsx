import { useState } from "react";
import { useMutation } from "react-query";
import { apiWithAuth } from "src/app/Http";
import { TextField } from "src/shared/TextField/TextField";
import { BottomPanel } from "src/widgets/BottomPanel/BottomPanel";

const ProductAdd: React.FC = () => {
  const [productInfo, setProductInfo] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [img, setImg] = useState<null | File>(null);
  const formData = new FormData();
  if (img) {
    formData.append("image", img);
  }
  formData.append("name", productInfo.name);
  formData.append("description", productInfo.description);
  formData.append("price", productInfo.price);

  const { mutate } = useMutation({
    mutationKey: "postProduct",
    mutationFn: async () => apiWithAuth.post("/products/", formData),
  });
  return (
    <main className="container pt-5">
      <label htmlFor="image">
        <input
          type="file"
          id="image"
          className="hidden"
          onChange={(e) => setImg(e.target.files && e.target.files[0])}
        />

        <div className="w-full min-h-80 border flex items-center justify-center rounded-2xl relative">
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
      <div className="pt-5 pb-20 flex flex-col gap-5">
        <TextField
          value={productInfo.name}
          setValue={(e) =>
            setProductInfo({ ...productInfo, name: e.target.value })
          }
          placeholder="Название"
        />
        <TextField
          value={productInfo.price}
          setValue={(e) =>
            setProductInfo({ ...productInfo, price: e.target.value })
          }
          placeholder="Цена"
          type="number"
        />
        <TextField
          value={productInfo.description}
          setValue={(e) =>
            setProductInfo({ ...productInfo, description: e.target.value })
          }
          placeholder="Описание"
          big
        />
      </div>
      <BottomPanel doneFunc={mutate} />
    </main>
  );
};

export { ProductAdd };

import { useState } from "react";
import { useMutation } from "react-query";
import { apiWithAuth } from "src/app/Http";
import { Autocomplete, TextField } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "src/app/hooks/useAppSelector";
// import { TextField } from "src/shared/TextField/TextField";
import { BottomPanel } from "src/widgets/BottomPanel/BottomPanel";
// import { Button } from "src/shared/Button/Button";
import "./ProdactManagement.scss";
import { useGetProduct } from "src/app/services/useGetProducts";

const ProdactManagement: React.FC = () => {
    const navigate = useNavigate();
    const isValid = true;
    const formData = new FormData();
    const { id } = useParams();
    const { data: products = [] } = useGetProduct();
    const [product, setProduct] = useState("");
    const { mutate, isLoading } = useMutation({
      mutationKey: "postProduct",
      mutationFn: async () =>
        apiWithAuth.post("/products/", formData).then(() => navigate(-1)),
    });

    const userName = useAppSelector((state) => state.userSlice.username);

    return (
      <main className="container pt-5 ">
        <div className="sort_content_prodact">
          <Link to={"/add/product"} className="button_sort_content">Добавить продукт</Link>
        {/* {
          productCategory.map((product, index) => {
            return (
              <div onClick={() => setProdactCategory(index)} className={prodactCategory === index ? "button_sort_content_active" : "button_sort_content"} key={index}>
                <h1>{product}</h1>
              </div>


              
            )
          })
        } */}
        </div>
        
  {userName === "admin" && (
  <>
    <br />
    <span className="font-bold gap-5">
     Список продуктов:
    </span>
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={
        products
          ? products
              .map((product) => {
                return {
                  label: product.name,
                  id: product.id,
                };
              })
          : []
      }
      onChange={(_, newValue) => {
        if (newValue) {
          setProduct(newValue?.id);
          // queryClient.invalidateQueries("getComposition");
        }
      }}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} />} 
    />
    {/* <Link to={"/add/product"} className="block pt-5">
      <Button title="Создать новый продукт" />
    </Link> */}
  </>
)}
        <br />
         <span className="font-bold gap-5">
     Список продуктов:
    </span>

    <div className="product_list">
      <div className="product_elem">refb</div>
      <div className="product_elem">refb</div>
      <div className="product_elem">refb</div>
    </div>
       
        <BottomPanel isValid={isValid} doneFunc={mutate} disabled={isLoading} />
      </main>
    );
  };
  
  export { ProdactManagement };
  
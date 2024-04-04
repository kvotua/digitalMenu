import { Product } from "src/entities/Product/Product";
import { BottomPanel } from "src/widgets/BottomPanel/BottomPanel";

const Composition: React.FC = () => {
  return (
    <main className="">
      <div className="w-full">
        <img src="/image.jpeg" alt="image" className="rounded" />
      </div>
      <Product />
      <BottomPanel />
    </main>
  );
};

export { Composition };

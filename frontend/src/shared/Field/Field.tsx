import { IField } from "./Field.model";

const Field: React.FC<IField> = ({ title, text }) => {
  return (
    <div className="flex justify-between items-center">
      <span>{title}</span>
      <span className="pb-2 text-xl font-bold">{text}</span>
    </div>
  );
};

export { Field };

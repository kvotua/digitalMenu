import { ChangeEvent, HTMLAttributes } from "react";

export interface ITextField extends HTMLAttributes<HTMLInputElement> {
  value: string;
  setValue: (e: ChangeEvent<HTMLInputElement>) => void;
}

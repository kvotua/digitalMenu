import { ChangeEvent, InputHTMLAttributes } from "react";

export interface ITextField
  extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  value: string | number;
  setValue: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  big?: boolean;
}

import { useDispatch } from "react-redux";
import type { AppDispatch } from "../Store";
/** **useAppDispatch** - это redux хук useDispatch со строгой типизацией */
export const useAppDispatch = () => useDispatch<AppDispatch>();

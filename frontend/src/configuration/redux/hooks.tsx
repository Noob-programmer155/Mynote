import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";

type Dispatch = () => AppDispatch
export const useAppDispatch: Dispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

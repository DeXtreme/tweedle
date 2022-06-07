import { useContext } from "react";
import { context } from "./context";

export function useAPI(){
    return useContext(context);
}
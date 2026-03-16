import { useContext } from "react";
import { BoxesContext } from "../components/layout/BoxesContent";

export function useBoxes() {
  return useContext(BoxesContext);
}
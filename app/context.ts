import { unstable_createContext } from "react-router";

export const toasterContext = unstable_createContext<{
  success: (text: string) => void;
  error: (text: string) => void;
}>();

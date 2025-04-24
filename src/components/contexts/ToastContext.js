import { createContext, useContext } from "react";

export const ToastContext = createContext({
  open: false,
});

export function useToastContext() {
  return useContext(ToastContext);
}

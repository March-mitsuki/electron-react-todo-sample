import { createContext, useContext } from "react";

// type
import type { AppCtx } from "./types";

export const appCtx = createContext({} as AppCtx);

export const useAppCtx = () => {
  return useContext(appCtx);
};

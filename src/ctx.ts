import { createContext, useContext } from "react";
import { App } from "obsidian";

export const useApp = (): App | undefined => {
	return useContext(AppContext);
};

export const AppContext = createContext<App | undefined>(undefined);

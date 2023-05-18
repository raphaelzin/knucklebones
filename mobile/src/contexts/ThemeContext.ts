import { Appearance } from "react-native";
import { createContext } from "react";
import { getStorageValue, setStorageValue } from "../userData/LocalStorage";

export interface Theme {
  readonly name: "dark" | "light";
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
}

const lightTheme: Theme = {
  name: "light",
  primaryColor: "#007bff",
  secondaryColor: "#6c757d",
  backgroundColor: "#f8f9fa",
  textColor: "#212529",
};

const darkTheme: Theme = {
  name: "dark",
  primaryColor: "#61dafb",
  secondaryColor: "#adb5bd",
  backgroundColor: "#212529",
  textColor: "#f8f9fa",
};

export const allThemeOptions = ["dark", "light", "auto"];
export type ThemeOption = "dark" | "light" | "auto";
export type ThemeName = "dark" | "light";

const getCurrentThemeName = async (): Promise<ThemeName> => {
  let themeName = (await getStorageValue("selected-theme")) ?? "auto";

  if (!allThemeOptions.includes(themeName)) {
    themeName = "auto";
  }

  if (themeName === "auto") {
    return themeName === "auto"
      ? Appearance.getColorScheme() ?? "light"
      : themeName;
  }

  return themeName as ThemeName;
};

export const setThemeName = async (themeName: ThemeOption) => {
  await setStorageValue(themeName, "selected-theme");
};

export const getTheme = async (): Promise<Theme> => {
  const themeName = await getCurrentThemeName();
  return themeName === "light" ? lightTheme : darkTheme;
};

interface ThemeContextProps {
  setTheme: (themeOption: ThemeOption) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  setTheme: (themeOption: ThemeOption) => {
    console.log("setTheme not implemented", themeOption);
  },
});

export default getTheme;

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

const getTheme = (isDarkMode: boolean): Theme => {
  return isDarkMode ? darkTheme : lightTheme;
};

export default getTheme;

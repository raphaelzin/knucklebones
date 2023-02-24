export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
}

const lightTheme: Theme = {
  primaryColor: "#007bff",
  secondaryColor: "#6c757d",
  backgroundColor: "#f8f9fa",
  textColor: "#212529",
};

const darkTheme: Theme = {
  primaryColor: "#61dafb",
  secondaryColor: "#adb5bd",
  backgroundColor: "#212529",
  textColor: "#f8f9fa",
};

const getTheme = (isDarkMode: boolean): Theme => {
  return isDarkMode ? darkTheme : lightTheme;
};

export default getTheme;

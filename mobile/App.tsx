import React, { useEffect, useState } from "react";
import { NavigationContainer, ThemeProvider } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "./src/scenes/Home";
import { Details } from "./src/scenes/Details";
import { Settings } from "./src/scenes/Settings";
import getTheme, {
  ThemeContext,
  ThemeName,
  ThemeOption,
  setThemeName
} from "./src/contexts/ThemeContext";
import { } from "react";

const Stack = createNativeStackNavigator();

export default function App() {
  // const theme = useState<ThemeName>("light")

  // useEffect(() => {
  //   console.log("Theme changed to", theme)
  // }, [theme])

  const setTheme = async (themeOption: ThemeOption) => {
    await setThemeName(themeOption);
  };

  return (
    <ThemeContext.Provider
      value={{
        setTheme
      }}
    >
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            options={{ title: "Knucklebones" }}
            component={Home}
          />
          <Stack.Screen name="Details" component={Details} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}

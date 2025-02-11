import React, { createContext, useContext, useState, useEffect } from "react";
import { DarkTheme, DefaultTheme, Theme } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Appearance} from "react-native";
import getColorScheme = Appearance.getColorScheme;
import AppLoader from "@/components/AppLoader";
import {useSelector} from "react-redux";
import {RootState} from "@/store/Store";

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(getColorScheme()==="dark");
  const preferencesStore = useSelector((store:RootState)=> store.preference);
  useEffect(() => {
    setIsDarkMode(preferencesStore.theme==="dark");
    console.log(preferencesStore)
  }, [preferencesStore]);

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    await AsyncStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme: isDarkMode ? DarkTheme : DefaultTheme, isDarkMode, toggleTheme }}>
      <AppLoader></AppLoader>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

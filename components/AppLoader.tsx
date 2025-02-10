import {ThemedView} from "@/components/ThemedView";
import Spinner from "react-native-loading-spinner-overlay";
import React, {useEffect, useState} from "react";
import {useThemeColor} from "@/hooks/useThemeColor";
import {ColorSchemeName, TextProps, useColorScheme} from "react-native";
import {useSelector} from "react-redux";
import {RootState} from "@/store/Store";
import {loadingStatus} from "@/store/user/UserAction";
import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";

export type Loader = TextProps & {
  children: React.ReactNode;
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export default function AppLoader({style,lightColor,darkColor,children,type = 'default',...rest}: Loader){
  const useStore = useSelector((store:RootState)=> store.user);
  const [theme, setTheme] = useState<ColorSchemeName>("light")
  const preferencesStore = useSelector((store:RootState)=> store.preference);
  const [isLoading, setIsLoading] = useState<boolean | undefined>(false);
  useEffect(() => {
    setTheme(preferencesStore.theme);
   setIsLoading(useStore.loading);
    console.log(preferencesStore.theme)
  }, [useStore,preferencesStore]);
  const themeColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    return (<>
      <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      {isLoading &&
      <Spinner
        visible={isLoading}
        textContent={'Loading...'}
        textStyle={{color:themeColor}}
      />
      }
      {children}
      </ThemeProvider>
    </>);
}

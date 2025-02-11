import {ThemedView} from "@/components/ThemedView";
import Spinner from "react-native-loading-spinner-overlay";
import React, {useEffect, useState} from "react";
import {useThemeColor} from "@/hooks/useThemeColor";
import {TextProps} from "react-native";
import {useSelector} from "react-redux";
import {RootState} from "@/store/Store";

export type Loader = TextProps & {
  lightColor?: string; darkColor?: string; type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export default function AppLoader({style, lightColor, darkColor, type = 'default', ...rest}: Loader) {
  const useStore = useSelector((store: RootState) => store.user);

  const [isLoading, setIsLoading] = useState<boolean | undefined>(false);
  useEffect(() => {
    setIsLoading(useStore.loading);
  }, [useStore]);
  const themeColor = useThemeColor({light: lightColor, dark: darkColor}, 'text');
  return (<>
    {isLoading && <ThemedView>
        <Spinner
            visible={isLoading}
            textContent={'Loading...'}
            textStyle={{color: themeColor}}
        />
    </ThemedView>}

  </>);
}

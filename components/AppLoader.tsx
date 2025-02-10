import {ThemedView} from "@/components/ThemedView";
import Spinner from "react-native-loading-spinner-overlay";
import React from "react";
import {useThemeColor} from "@/hooks/useThemeColor";
import type {TextProps} from "react-native";

export type Loader = TextProps & {
  loading:boolean,
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export default function AppLoader({loading,style,lightColor,darkColor,type = 'default',...rest}: Loader){
  const themeColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    return (<ThemedView>
      {loading &&
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{color:themeColor}}
      />
      }
    </ThemedView>);
}

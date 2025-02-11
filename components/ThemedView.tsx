import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import {useEffect} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/store/Store";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const preferenceState = useSelector((store: RootState) => store.preference);
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background',preferenceState.theme);
  useEffect(() => {
  }, [preferenceState]);

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

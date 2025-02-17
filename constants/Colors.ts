/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
import {store} from "@/store/Store";

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: 'rgba(239,239,239,0.87)',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#343434',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
export const getColor=()=>{
 const theme= store.getState().preference.theme;
  let color={
    text: '#ECEDEE',
    placeholder:'#8d8a8a',
    background: '#343434',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  }
  if(theme==="light"){
    color={
      text: '#11181C',
      placeholder:'#212b31',
      background: 'rgba(239,239,239,0.87)',
      tint: tintColorLight,
      icon: '#687076',
      tabIconDefault: '#687076',
      tabIconSelected: tintColorLight,
    }
  }
  return color;
}

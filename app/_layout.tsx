import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from 'expo-status-bar';
import {useEffect} from 'react';
import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/useColorScheme';
import {Provider} from "react-redux";
import {persistor, store} from "@/store/Store";
import {PersistGate} from "redux-persist/integration/react";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (<Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            {/*        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />*/}
            <Stack.Screen name="+not-found"/>
            <Stack.Screen name="index" options={{title: "Start ABCD App"}} key={"index"}/>
            <Stack.Screen name="pages/frame-view" options={{title: "Web view"}} key={"frame-view"} />
            <Stack.Screen name="pages/login" options={{title: "Login Our App"}} key={"login"}/>
            <Stack.Screen name="pages/[id]" options={{headerShown: false}} key={"id"}/>
            <Stack.Screen name="pages/dashboard" options={{headerShown: false}} key={"dashboard"}/>
            <Stack.Screen name="pages/checkout" options={{title: "Checkout Payment"}}/>
            <Stack.Screen name="pages/test" options={{title: "Checkout Payment"}}/>
            <Stack.Screen name="pages/test2" options={{title: "Checkout Payment"}}/>
            <Stack.Screen name="pages/test3" options={{title: "Checkout Payment"}}/>
          </Stack>
          <StatusBar style="auto"/>
        </ThemeProvider>
      </PersistGate>
    </Provider>

  );
}

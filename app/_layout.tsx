import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from 'expo-status-bar';
import React, {useEffect} from 'react';
import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/useColorScheme';
import {Provider} from "react-redux";
import {persistor, store} from "@/store/Store";
import {PersistGate} from "redux-persist/integration/react";
import AppLoader from "@/components/AppLoader";
import AppHeader from "@/components/header/header";
import {ThemeProvider} from "@/context/ThemeProvider";

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
        <StatusBar style="auto"/>
          <ThemeProvider>
            <Stack>
              <Stack.Screen name="+not-found"/>
              <Stack.Screen name="index" options={{title: "Start ABCD App"}} key={"index"}/>
              <Stack.Screen name="pages/frame-view" options={{title: "Web view"}} key={"frame-view"}/>
              <Stack.Screen name="pages/login" options={{title: "Register App"}} key={"login"}/>
              <Stack.Screen name="pages/register" options={{title: "Login"}} key={"register"}/>
              <Stack.Screen name="pages/dashboard" options={{header: () => <AppHeader/>}} key={"dashboard"}/>
              <Stack.Screen name="pages/checkout" options={{title: "Checkout Payment"}}/>
              <Stack.Screen name="pages/test" options={{title: "Checkout Payment"}}/>
            </Stack>
          </ThemeProvider>
      </PersistGate>
    </Provider>

  );
}

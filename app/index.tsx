import React, {useEffect, useRef, useState} from "react";
import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useRouter} from "expo-router";
import * as Notifications from 'expo-notifications';
import firebase from "firebase/compat";
import {registerForPushNotificationsAsync} from "@/util/push-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {IUser} from "@/service/user-service";
import {useDispatch, useSelector} from "react-redux";

import {AppDispatch, RootState} from "@/store/Store";
import {setAuthPushId} from "@/store/auth/AuthAction";

export default function HomeScreen() {
  const useStore = useSelector((store:RootState)=> store.user);
  const authStore = useSelector((store:RootState)=> store.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useRouter();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: true,
    }),
  });
  useEffect(() => {
    if (Platform.OS !== "web") {
      setUpNotification();
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        console.log("up ", notification)
        setNotification(notification);
      });
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {

        navigation.push({
          pathname: "/pages/checkout",
          params: {data: JSON.stringify(response.notification.request.content.data)}
        });

      });

      return () => {
        notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
        responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
      };
    }
    isUserLogged();
  }, []);

  async function isUserLogged() {

    if (authStore.token) {
        navigation.push({pathname: "/pages/dashboard"});
    }
  }

  function setUpNotification() {
    registerForPushNotificationsAsync()
      .then(async pushID => {
          dispatch(setAuthPushId(pushID));
        setExpoPushToken(pushID ?? '')
      })
      .catch((error: any) => setExpoPushToken(`${error}`));

  }

  return (<View style={styles.container}>
      {/* Logo or Image */}
      <Image
        source={{
          uri: "https://example.com/your-image.png", // Replace with your image URL
        }}
        style={styles.image}
      />

      {/* Welcome Text */}
      <Text style={styles.title}>Welcome to Our App</Text>
      <Text style={styles.subtitle}>
        Discover amazing features and get started on your journey!
      </Text>

      {/* Get Started Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.push("/pages/login")} // Navigate to Home screen
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#ffffff", // Background color
    paddingHorizontal: 20,
  }, image: {
    width: 200, height: 200, marginBottom: 20,
  }, title: {
    fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 10,
  }, subtitle: {
    fontSize: 16, color: "#666", textAlign: "center", marginBottom: 30,
  }, button: {
    backgroundColor: "#007bff", // Button color
    paddingVertical: 15, paddingHorizontal: 40, borderRadius: 10,
  }, buttonText: {
    color: "#fff", fontSize: 16, fontWeight: "bold",
  },
});

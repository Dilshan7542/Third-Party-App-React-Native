import React, {useEffect, useRef, useState} from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import firebase from "firebase/compat";
import messaging = firebase.messaging;
import {registerForPushNotificationsAsync} from "@/util/push-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {platform} from "node:os";

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useRouter();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  useEffect(() => {
    if(Platform.OS!=="web"){
      setUpNotification();
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        console.log("up ",notification)
        setNotification(notification);
      });
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
        console.log(response.notification.request.content);
        navigation.push({pathname:"/pages/checkout"});

      });

      return () => {
        notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
        responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
      };
    }
  }, []);
 function setUpNotification(){
   registerForPushNotificationsAsync()
     .then(async token => {
       console.log(token);
       await AsyncStorage.setItem("pushId",token || "");
       setExpoPushToken(token ?? ''
       )})
     .catch((error: any) => setExpoPushToken(`${error}`));

  }
  return (
    <View style={styles.container}>
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
        onPress={() => router.push("/pages/login")} // Navigate to Home screen
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff", // Background color
    paddingHorizontal: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#007bff", // Button color
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

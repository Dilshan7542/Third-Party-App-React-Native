import React, {useEffect, useRef, useState} from "react";
import {Image, Platform, StyleSheet, Text, TouchableOpacity, View, Alert} from "react-native";
import {useRouter} from "expo-router";
import * as Notifications from 'expo-notifications';
import {registerForPushNotificationsAsync} from "@/util/push-notification";
import {useDispatch, useSelector} from "react-redux";

import {AppDispatch, RootState, store} from "@/store/Store";
import {setAuthPushId} from "@/store/auth/AuthAction";
import {readyToCheckout} from "@/store/checkout/CheckoutAction";
import {readyToCheckoutApi} from "@/service/client-service";
import {SUCCESS} from "@/constants/ResponseCode";
import {CheckoutTransaction} from "@/store/checkout/CheckoutReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const authStore = useSelector((store: RootState) => store.auth);
  const checkoutStore = useSelector((store: RootState) => store.checkout);
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
          let dataString=response.notification.request.content.data;
        let stateUser = store.getState().user;
        try {
          let data: any;
          if(typeof dataString ==="string"){
            alert("1");
            try {
            data=JSON.parse(dataString);
            }catch (e){
              Alert.alert("error dataString",JSON.stringify(e));
            }
          }else{
            data=dataString;
          }
          if(stateUser){
            if (stateUser.user) {
              readyToCheckoutApi(stateUser.user.nic).then(resp => {
                if (resp.status === SUCCESS) {
                  const content = resp.content;
                  console.log("response content ", resp.content)
                  const newDate = new Date();
                  const date = newDate.toISOString().split("T")[0] + "  " + newDate.getHours() + ":" + newDate.getMinutes() + ":" + newDate.getMilliseconds();
                  const trans: CheckoutTransaction = {
                    date: date,
                    accountName: content.toAccountName,
                    fromAccountList: content.fromAccountList,
                    toAccount: content.toAccount,
                    amount: data.amount || 1000000,
                    ref: data.refNumber
                  }
                  Alert.alert("Build Trans",JSON.stringify(trans));
                  dispatch(readyToCheckout(trans))
                  navigation.push({
                    pathname: "/pages/checkout"
                  });
                } else {
                  Alert.alert(resp.status,resp.message);
                }
              }).catch(error => {
                Alert.alert("Error 500",JSON.stringify(error));
              });
            }
          }else{
            alert("store user undefined")
          }

        } catch (e) {
          Alert.alert("Wrap Notification Error",JSON.stringify(e));
        }
      });

      return () => {
        notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
        responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
      };
    }
    isUserLogged();
  }, []);
  useEffect(() => {
    return () => {
    };
  }, []);

  async function isUserLogged() {
    if (authStore.token) {
      setTimeout(() => {
        navigation.navigate({pathname: "/pages/dashboard"});
      }, 100)
    }
  }

  function setUpNotification() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
    registerForPushNotificationsAsync()
      .then(async pushID => {
        if(pushID){
        await AsyncStorage.setItem("app-push",pushID)
        dispatch(setAuthPushId(pushID));
        }
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

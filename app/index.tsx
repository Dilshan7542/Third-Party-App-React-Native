import React, {useEffect, useRef, useState} from "react";
import {Image, Platform, StyleSheet, Text, TouchableOpacity, View, Alert} from "react-native";
import {useRouter} from "expo-router";
import * as Notifications from 'expo-notifications';
import {registerForPushNotificationsAsync} from "@/util/push-notification";
import {useDispatch, useSelector} from "react-redux";

import {AppDispatch, RootState} from "@/store/Store";
import {setAuthPushId} from "@/store/auth/AuthAction";
import {readyToCheckout} from "@/store/checkout/CheckoutAction";
import {readyToCheckoutApi} from "@/service/client-service";
import {SUCCESS} from "@/constants/ResponseCode";
import {CheckoutTransaction} from "@/store/checkout/CheckoutReducer";

export default function HomeScreen() {
  const useStore = useSelector((store: RootState) => store.user);
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
        Alert.alert("notification work 2",JSON.stringify(response.notification));
        try {
          alert("notification work 3");
          let dataString:any;
          try {
            dataString=response.notification.request.content.data;
          }catch (e){
            alert("Second chatch occur");
          }
         const test= JSON.stringify(dataString);
          alert(test);
         Alert.alert("Check debug",test);
          alert("notification work 4");
          let data: any;

          if (dataString) {
            try {
            Alert.alert("data sting",JSON.stringify(dataString));
            }catch (e){
              alert("data string error");
            }
            if (dataString.body) {
              data = JSON.parse(dataString.body);
              alert("notification work 52");
            } else {
              data.amount = 6000000;
              data.refNumber = "TestDemoRef 2";
              alert("notification work 5");
            }
          } else {
            data.amount = 5000000;
            data.refNumber = "TestDemoRef";
            alert("notification work 6");
          }
          alert("notification work 7");
          console.log(data);
          alert(dataString);
          if (!useStore.user) {
            alert("User not exist");
          }
          console.log(useStore.user);
          if (useStore.user) {
            readyToCheckoutApi(useStore.user.nic).then(resp => {
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
                console.log("\n\n\nbuild trans :", trans)
                dispatch(readyToCheckout(trans))
                navigation.push({
                  pathname: "/pages/checkout"
                });
              } else {
                alert(resp.message);
              }
            }).catch(error => {
              alert("Error 500");
              Alert.alert("Check debug",JSON.stringify(response.notification.request.content));
              alert("Error 500" + error.toString());
            });
          }
        } catch (e) {
          alert("throw error");
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

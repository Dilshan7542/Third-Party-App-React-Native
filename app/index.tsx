import React, {useEffect, useRef, useState} from "react";
import {Alert, Image, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useRouter} from "expo-router";
import * as Notifications from 'expo-notifications';
import {registerForPushNotificationsAsync} from "@/util/push-notification";
import {useDispatch, useSelector} from "react-redux";

import * as TaskManager from 'expo-task-manager';
import {AppDispatch, RootState, store} from "@/store/Store";
import {setAuthPushId} from "@/store/auth/AuthAction";
import {readyToCheckout} from "@/store/checkout/CheckoutAction";
import {readyToCheckoutApi} from "@/service/client-service";
import {SUCCESS} from "@/constants/ResponseCode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {loadingStatus} from "@/store/user/UserAction";
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import {TaskManagerTaskBody} from "expo-task-manager";

  const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';
export default function AppScreen() {
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
    dispatch(loadingStatus(false));

    if (Platform.OS !== "web") {
      setUpNotification();
      registerBackgroundNotificationTask();

      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        if (response) {
          Alert.alert("Received Notification ", JSON.stringify(response))
          handleNotificationResponse(response,"Received")
        }else{
          alert("Received Response undefined");
        }
      });

      Notifications.getLastNotificationResponseAsync().then(response => {
        if(response){
        Alert.alert("Last Notification ", JSON.stringify(response))
        }else{
        Alert.alert("Last undefined");
        }
        if (response) {
          handleNotificationResponse(response,"GET");
        }
      });
      return () => {
        notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
        responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
      };
    }
    isUserLogged();
  }, []);

  async function registerBackgroundNotificationTask() {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_NOTIFICATION_TASK
    );
    if (!isRegistered) {
      await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
      console.log("Background notification task registered.");
    }
    // @ts-ignore
    TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error }) => {
      alert("BackGround Work");

      if (error) {
      alert("BackGround Error = "+ JSON.stringify(error));

      }
      if (data) {
      alert("BackGround Data = "+ JSON.stringify(data));
      }
    });

  }
  const handleNotificationResponse = async (response: Notifications.NotificationResponse,location:string) => {
    alert(location)
    try {
      let dataString = response.notification.request.content.data;
      let data: any = typeof dataString === "string" ? JSON.parse(dataString) : dataString;
      console.log("Notification Data:", data);
      // Fetch user state
      const stateUser = store.getState().user;
      if (stateUser?.user) {
        const resp = await readyToCheckoutApi(stateUser.user.nic);
        Alert.alert("Response Api ",JSON.stringify(resp));
        if (resp.status === SUCCESS) {
          const content = resp.content;
          const newDate = new Date();
          const date = newDate.toISOString().split("T")[0] + " " + newDate.getHours() + ":" + newDate.getMinutes() + ":" + newDate.getMilliseconds();

          const trans = {
            date,
            accountName: content.toAccountName,
            fromAccountList: content.fromAccountList,
            toAccount: content.toAccount,
            amount: data.amount || 1000000,
            ref: data.refNumber
          };
          Alert.alert("Trans ",JSON.stringify(trans));
          dispatch(readyToCheckout(trans));
          navigation.navigate("/pages/checkout");
        } else {
          Alert.alert("Response Error  ",JSON.stringify(resp));
        }
      } else {
        alert("User data not found in store.");
      }
    } catch (error) {
      console.error("Error handling notification:", error);
    }
  };

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
        shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: true,
      }),
    });
    registerForPushNotificationsAsync()
      .then(async pushID => {
        if (pushID) {
          await AsyncStorage.setItem("app-push", pushID)
          dispatch(setAuthPushId(pushID));
        }
        setExpoPushToken(pushID ?? '')
      })
      .catch((error: any) => setExpoPushToken(`${error}`));

  }

  return (<SafeAreaView style={styles.container}>
    <ThemedView
      style={{display: "flex", justifyContent: "space-evenly", alignItems: "center", height: "100%", width: "100%"}}>
      <View style={{width: "100%"}}>
        <Image
          source={require("../assets/images/start-page.jpg")}
          style={styles.image}
        />
      </View>
      <View style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        <ThemedText style={styles.title}>Welcome to Our App</ThemedText>
        <ThemedText style={styles.subtitle}>
          Discover amazing features and get started on your journey!
        </ThemedText>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.push("/pages/login")} // Navigate to Home screen
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  </SafeAreaView>);
}

const styles = StyleSheet.create({
  container: {
    display: "flex", flex: 1, alignItems: "center", // Background color
  }, image: {
    width: "100%", height: 250, marginBottom: 20, borderRadius: 12
  }, title: {
    padding: 10, fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 10,
  }, subtitle: {
    fontSize: 16, textAlign: "center", marginBottom: 30,
  }, button: {
    backgroundColor: "#007bff", // Button color
    paddingVertical: 15, paddingHorizontal: 40, borderRadius: 10,
  }, buttonText: {
    color: "#fff", fontSize: 16, fontWeight: "bold",
  },
});

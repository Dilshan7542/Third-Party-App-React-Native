import {Alert, AppState, Image, Linking, Platform, StyleSheet, TouchableOpacity, View} from "react-native";
import {ThemedView} from "@/components/ThemedView";
import {Link, useLocalSearchParams, useRouter} from "expo-router";
import {ThemedText} from "@/components/ThemedText";
import {IUser, startSession} from "@/service/user-service";
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppHeader from "@/components/header/header";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store/Store";
import {openBrowserAsync} from "expo-web-browser";
import {CheckoutTransaction} from "@/store/checkout/CheckoutReducer";
import {readyToCheckout} from "@/store/checkout/CheckoutAction";


export default function DashBoard() {
  const navigation = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [nic, setNic] = useState("");
  const [name, setName] = useState("")
  const userState = useSelector((store:RootState)=> store.user);
  const authState = useSelector((store:RootState)=> store.auth);
  useEffect(() => {
    isUserLogin();
  }, []);

  async function isUserLogin() {
    if (!authState.token || !userState.user) {
    navigation.push({pathname: "/pages/login"});
    }else{
      if(userState.user){
        setNic(userState.user.nic);
        setName(userState.user.name);
      }
    }
  }

  const redirect = async () => {
    let pushId = authState.pushId;
    pushId=pushId ? pushId:"ExponentPushToken[a41kKlNuhfjA4csFLLu586]";
    console.log(pushId);
    if (pushId && userState.user) startSession(userState.user.nic, pushId).then(resp => {
      console.log(resp);
      let url = resp.content.url;
      openBrowser(url);
    }).catch(error=>{
      console.log(error)
      alert(error);
    });
  }
  const openBrowser = (url: string) => {
    openBrowserAsync(url).catch(()=>{
      console.error("Error Browser not available");
    Linking.openURL(url).catch((err) => console.error("An error occurred", err))
    });
  };
const test=()=>{
  const trans: CheckoutTransaction = {
    date: new Date().toISOString(),
    accountName: "Dilshan",
    fromAccountList: ["10","20"],
    toAccount: "545456456454",
    amount:  1000000,
    ref: "ref65454654654"
  }
  Alert.alert("Build Trans",JSON.stringify(trans));
  dispatch(readyToCheckout(trans))
  navigation.push({
    pathname: "/pages/checkout"
  });
}
  return (<ThemedView style={{flex:1}}>
  <AppHeader name={name}></AppHeader>
    <ThemedView style={{...styles.flexCenter, justifyContent: "center", alignItems: "center",minHeight:"50%"}}>
  <ThemedView style={{display: "flex", width: '100%', flexDirection: "row", padding: 5, flexWrap: "wrap"}}>
  <TouchableOpacity style={styles.cartItem} onPress={redirect}>
  <ThemedView style={styles.cartChildItem}>
  <Image
    source={require("../../assets/images/Sweep-logo.png")}
  style={styles.cartImage}/>
  <ThemedText>DLB App</ThemedText>
  </ThemedView>
  </TouchableOpacity>
  <TouchableOpacity style={styles.cartItem} onPress={test}>
  <ThemedView style={styles.cartChildItem}>
  <Image
    source={require("../../assets/images/nlb.png")}
  style={styles.cartImage}/>
  <ThemedText>NLB Apps</ThemedText>
  </ThemedView>
  </TouchableOpacity>
  <TouchableOpacity style={styles.cartItem}>
  <Link href={{pathname: "/pages/frame-view", params: {url: "https://www.google.com/"}}}>
  <ThemedView style={styles.cartChildItem}>
  <Image
    source={require("../../assets/images/damro.png")}
  style={styles.cartImage}/>
  <ThemedText>Damro App</ThemedText>
  </ThemedView>
  </Link>
  </TouchableOpacity>
  <TouchableOpacity style={styles.cartItem}>
  <ThemedView style={styles.cartChildItem}>
  <Image
    source={require("../../assets/images/iit.png")}
  style={styles.cartImage}/>
  <ThemedText>IIT</ThemedText>
  </ThemedView>
  </TouchableOpacity>
  <TouchableOpacity style={styles.cartItem}>
  <ThemedView style={styles.cartChildItem}>
  <Image
    source={require("../../assets/images/damro.png")}
  style={styles.cartImage}/>
  <ThemedText>Damro</ThemedText>
  </ThemedView>
  </TouchableOpacity>
  <TouchableOpacity style={styles.cartItem}>
  <ThemedView style={styles.cartChildItem}>
  <Image
    source={require("../../assets/images/keels.png")}
  style={styles.cartImage}/>
  <ThemedText>Keels</ThemedText>
  </ThemedView>
  </TouchableOpacity>
  <TouchableOpacity style={styles.cartItem}>
  <ThemedView style={styles.cartChildItem}>
  <Image
    source={require("../../assets/images/foodCity.jpg")}
  style={styles.cartImage}/>
  <ThemedText>Food City</ThemedText>
  </ThemedView>
  </TouchableOpacity>

  <TouchableOpacity style={styles.cartItem}>
    <Link href={"/pages/checkout"}>
  <ThemedView style={styles.cartChildItem}>
  <Image
    source={require("../../assets/images/abans.png")}
  style={styles.cartImage}/>
  <ThemedText>Abans</ThemedText>
  </ThemedView>
    </Link>
  </TouchableOpacity>
  </ThemedView>
  </ThemedView>

  </ThemedView>)
}
const styles = StyleSheet.create({
  container: {
    flex: 1, // Make the container fill the entire screen
  }, flexCenter: {
    justifyContent: "center", alignItems: "center", display: "flex",
  }, cartItem: {
    borderStyle: "solid", width: '25%', marginTop: 5, display: "flex", justifyContent: "center", alignItems: "center"
  }, cartChildItem: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "gray",
    padding: 5,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  }, cartImage: {
    width: 70, height: 60, borderRadius: 12
  }
});


/*  return (
    <SafeAreaView style={styles.container}>
      <WebView
        style={styles.webView}
        source={{
          uri: "http://192.168.137.78:4200/#/pre/faq"
        }}
        onNavigationStateChange={(state) => {
        }}
        startInLoadingState={true}
      />
    </SafeAreaView>);*/

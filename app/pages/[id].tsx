import {Image, Linking, Platform, StyleSheet, TouchableOpacity, View} from "react-native";
import {ThemedView} from "@/components/ThemedView";
import {Link, useLocalSearchParams, useRouter} from "expo-router";
import {ThemedText} from "@/components/ThemedText";
import {startSession} from "@/service/user-service";
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppHeader from "@/components/header/header";


export default function Id() {
  const params = useLocalSearchParams();
  const nicPram: string = params['nic']?.toString();
  const nameParam: string = params['name']?.toString();
  const navigation = useRouter();
  const [nic, setNic] = useState(nicPram);
  const [name, setName] = useState(nameParam)
  useEffect(() => {
    isUserLogin();
  }, []);

  async function isUserLogin() {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      navigation.push({pathname: "/pages/login"});
      AsyncStorage.clear().then();
    }
  }

  const redirect = async () => {
    const pushId = await AsyncStorage.getItem("pushId");
    alert(pushId);
    if (pushId) startSession(nic, pushId).then(resp => {
      console.log(resp);
      let url = resp.content.url;
//    url=url.replace("https://epictechdev.com:50315","http://localhost:4200")
      openBrowser(url);
    });
  }
  const openBrowser = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("An error occurred", err));
  };

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
          <TouchableOpacity style={styles.cartItem}>
            <Link href={{pathname: "/pages/frame-view", params: {url: "https://www.google.com/", nic: nic}}}>
              <ThemedView style={styles.cartChildItem}>
                <Image
                  source={require("../../assets/images/nlb.png")}
                  style={styles.cartImage}/>
                <ThemedText>DLB Apps</ThemedText>
              </ThemedView>
            </Link>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartItem}>
            <Link href={{pathname: "/pages/frame-view", params: {url: "https://www.google.com/"}}}>
              <ThemedView style={styles.cartChildItem}>
                <Image
                  source={require("../../assets/images/damro.png")}
                  style={styles.cartImage}/>
                <ThemedText>DLB App</ThemedText>
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
            <ThemedView style={styles.cartChildItem}>
              <Image
                source={require("../../assets/images/abans.png")}
                style={styles.cartImage}/>
              <ThemedText>Abans</ThemedText>
            </ThemedView>
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

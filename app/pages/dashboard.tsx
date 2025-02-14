import {Alert, Animated, Image, Linking, StyleSheet, TouchableOpacity, View} from "react-native";
import {ThemedView} from "@/components/ThemedView";
import {Link, useRouter} from "expo-router";
import {ThemedText} from "@/components/ThemedText";
import {IUser, startSession} from "@/service/user-service";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store/Store";
import {openBrowserAsync} from "expo-web-browser";
import {CheckoutTransaction} from "@/store/checkout/CheckoutReducer";
import {readyToCheckout} from "@/store/checkout/CheckoutAction";
import {registerForPushNotificationsAsync} from "@/util/push-notification";
import DashboardSlider from "@/components/sliders/DashboardSlider";

import ScrollView = Animated.ScrollView;
import {loadingStatus} from "@/store/user/UserAction";
const tileCartList:{name:string,icon:string,url:string}[]=[
  {name:"Pay",icon:"",url:""},
  {name:"Scan QR",icon:"",url:""},
  {name:"Send",icon:"",url:""},
  {name:"Reload",icon:"",url:""},
]

export default function DashBoard() {
  const navigation = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const userState = useSelector((store: RootState) => store.user);
  const authState = useSelector((store: RootState) => store.auth);
  useEffect(() => {
    isUserLogin();
  }, []);

  async function isUserLogin() {
    if (!authState.token || !userState.user) {
      navigation.push({pathname: "/pages/login"});
    } else {
      if (userState.user) {
        setUser(userState.user);
      }
    }
  }

  const redirect = async () => {

    registerForPushNotificationsAsync()
      .then(async pushID => {
        dispatch(loadingStatus(true));
        if (pushID) {
          startSession(pushID).then(resp => {
            console.log(resp);
            let url = resp.content.url;
            openBrowser(url);
          }).catch(error => {
            console.log(error)
            Alert.alert("Check User Error",JSON.stringify(error));
          }).finally(()=>{
            dispatch(loadingStatus(false));
          });
        }
      }).catch((error: any) => {
      });
  }
  const openBrowser = (url: string) => {
    openBrowserAsync(url).catch(() => {
      console.error("Error Browser not available");
      Linking.openURL(url).catch((err) => console.error("An error occurred", err))
    });
  };
  const test = (status: number) => {
    const trans: CheckoutTransaction = {
      date: new Date().toISOString(),
      accountName: "Dilshan",
      fromAccountList: ["10", "20"],
      toAccount: "545456456454",
      amount: 1000000,
      ref: "ref65454654654"
    }
    Alert.alert("Build Trans", JSON.stringify(trans));
    dispatch(readyToCheckout(trans))
    if (status === 1) {
      navigation.navigate({
        pathname: "/pages/test"
      });
    }
    /* else if(status==2){
       navigation.push({
         pathname: "/pages/test2"
       });
     }else if(status ==3){
       navigation.push({
         pathname: "/pages/test3"
       });
     }*/

  }
  return (
  <ThemedView style={{flex: 1}}>
    <ScrollView>
      <ThemedView style={{...styles.flexCenter, minHeight: "50%"}}>
        <ThemedView style={{paddingTop:10}}>
          <DashboardSlider></DashboardSlider>
        </ThemedView>
        <ThemedView style={styles.tileCartSection}>
          {tileCartList.map((list,index)=>
            <View style={styles.tileCartItem} key={index}>
              <ThemedView style={styles.tileCartChild} lightColor={"#ffffff"}>
                <ThemedText>{list.name}</ThemedText>
              </ThemedView>
            </View>
          )}
        </ThemedView>
        <ThemedView style={{display: "flex", width: '100%', flexDirection: "row", padding: 5, flexWrap: "wrap"}}>
          <TouchableOpacity style={styles.cartItem} onPress={redirect}>
            <ThemedView style={styles.cartChildItem}>
              <Image
                source={require("../../assets/images/Sweep-logo.png")}
                style={styles.cartImage}/>
              <ThemedText>DLB</ThemedText>
            </ThemedView>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartItem} onPress={() => {
            test(1)
          }}>
            <ThemedView style={styles.cartChildItem}>
              <Image
                source={require("../../assets/images/nlb.png")}
                style={styles.cartImage}/>
              <ThemedText>NLB</ThemedText>
            </ThemedView>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartItem} onPress={() => {
            test(0)
          }}>
            <ThemedView style={styles.cartChildItem}>
              <Image
                source={require("../../assets/images/damro.png")}
                style={styles.cartImage}/>
              <ThemedText>Damro App</ThemedText>
            </ThemedView>

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
                source={require("../../assets/images/merchant/ez-cash.png")}
                style={styles.cartImage}/>
              <ThemedText>Ez Cash</ThemedText>
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
          <TouchableOpacity style={styles.cartItem} onPress={() => {
            test(1)
          }}>
            <ThemedView style={styles.cartChildItem}>
              <Image
                source={require("../../assets/images/nlb.png")}
                style={styles.cartImage}/>
              <ThemedText>Test 01</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

    </ScrollView>
  </ThemedView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1, // Make the container fill the entire screen
  }, flexCenter: {
    justifyContent: "center", alignItems: "center", display: "flex",
  },
  tileCartSection:{
    display:'flex',flexDirection:"row",
    height:70,
  },
  tileCartItem:{
   flex:1,
    display:"flex",
    alignItems:"center",
    height:"100%"
  },
  tileCartChild:{
    padding:5,
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    borderWidth:1,
    borderRadius: 12,
    borderColor: "gray",
    height:"95%",
    width:"95%"
  },
  cartItem: {
    borderStyle: "solid", width: '25%', marginTop: 5, display: "flex", justifyContent: "center", alignItems: "center"
  },
  cartChildItem: {
    width:"95%",
    height:100,
    gap:10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "gray",
    padding: 2,
    justifyContent: "center",
    alignItems: "center"
  },
  cartImage: {
    width:40, height: 40, borderRadius: 5,padding:10
  }
});

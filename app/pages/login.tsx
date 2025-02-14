import React, {useEffect, useState} from "react";
import {Alert, Button, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {Link, useLocalSearchParams, useRouter} from "expo-router";
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import {useSelector,useDispatch} from "react-redux";
import {AppDispatch, RootState} from "@/store/Store";
import {loadingStatus, userLoginAsync} from "@/store/user/UserAction";
import DashboardSlider from "@/components/sliders/DashboardSlider";
import {getColor} from "@/constants/Colors";

const LoginScreen = () => {
  const params = useLocalSearchParams();
  const nicPram: string = params['nic']?.toString();

  const useStore = useSelector((store:RootState)=> store.user);
  const tokenStore = useSelector((store:RootState)=> store.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [nic, setNic] = useState(nicPram ? nicPram:"");
  const [password, setPassword] = useState("");
  const navigation = useRouter();
  useEffect(() => {
    checkUserIfExist();
  }, []);
  const checkUserIfExist = async () => {
    if (tokenStore.token) {
      navigation.push({pathname: "/pages/dashboard"});
    }
  }
  const handleLogin = () => {
 dispatch(loadingStatus(true));
    if (!nic || !password) {
      Alert.alert("Error login 01", "Please fill out all fields!");
    } else {
        dispatch(userLoginAsync({nic,password})).then(res=>{
          navigation.push({pathname: "/pages/dashboard"});
          console.log(res);
        }).catch(error=>{
        Alert.alert("Error Login 02",JSON.stringify(error));
        }).finally(()=>{
          dispatch(loadingStatus(false));
          });
    }
  };
  return (
    <ThemedView style={styles.container}>
 <View style={{display:"flex",width:"100%"}}>
   <View style={{width:"100%",height:"50%",display:"flex",alignItems:"center",justifyContent:"flex-end"}}>
   <DashboardSlider></DashboardSlider>
   </View>
   <View style={{padding:20}}>
     <ThemedText style={styles.title}>Login</ThemedText>
     <ThemedView>
       <TextInput
         style={styles.input}
         placeholderTextColor={getColor().placeholder}
         placeholder="NIC"
         value={nic}
         onChangeText={setNic}
         keyboardType="default"
       />
       <TextInput
         style={styles.input}
         placeholderTextColor={getColor().placeholder}
         placeholder="Password"
         value={password}
         onChangeText={setPassword}
         secureTextEntry
       />
       <ThemedView style={{display:"flex",justifyContent:"space-between",width:"100%",gap:10}}>
         <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
           <ThemedText lightColor={"white"} darkColor={"black"} style={styles.buttonText}>Login</ThemedText>
         </TouchableOpacity>
         <Link href={"/pages/register"} style={styles.buttonRegister}>
           <ThemedText style={styles.buttonText}>Register</ThemedText>
         </Link>
       </ThemedView>
     </ThemedView>
   </View>

 </View>
  </ThemedView>);
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }, title: {
    fontSize: 24, fontWeight: "bold", marginBottom: 20,textAlign:"center"
  },
  loginBackground:{
    width:"100%",
    height:"100%",
    backgroundColor:"red"
  },
  input: {
    width: "100%",
    height: 50,
    color:getColor().text,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonText:{
fontWeight:"bold",textAlign:"center"
  },
  buttonLogin: {
    backgroundColor: '#00a4fd',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonRegister:{
    backgroundColor:"rgba(225,222,222,0.32)",
    display:"flex",flexDirection:"row",justifyContent:"center",padding:10
  }
});

export default LoginScreen;

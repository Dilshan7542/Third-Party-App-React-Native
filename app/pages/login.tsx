import React, {useEffect, useState} from "react";
import {Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity} from "react-native";
import {Link, useLocalSearchParams, useRouter} from "expo-router";
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import {useSelector,useDispatch} from "react-redux";
import {AppDispatch, RootState} from "@/store/Store";
import {userLoginAsync} from "@/store/user/UserAction";
import AppLoader from "@/components/AppLoader";

const LoginScreen = () => {
  const params = useLocalSearchParams();
  const nicPram: string = params['nic']?.toString();
  const [loader, setLoader] = useState(true);
  const useStore = useSelector((store:RootState)=> store.user);
  const tokenStore = useSelector((store:RootState)=> store.auth);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    checkUserIfExist();
  }, []);
  const checkUserIfExist = async () => {
    if (tokenStore.token) {
      navigation.push({pathname: "/pages/dashboard"});
    }
  }

  const [nic, setNic] = useState(nicPram ? nicPram:"");
  const [password, setPassword] = useState("");
  const navigation = useRouter();
  const handleLogin = () => {
    setLoader(true);
    if (!nic || !password) {
      Alert.alert("Error", "Please fill out all fields!");
    } else {
        dispatch(userLoginAsync({nic,password})).then(res=>{
          navigation.push({pathname: "/pages/dashboard"});
          console.log(res);
        }).catch(error=>{
        Alert.alert("Error",JSON.stringify(error));
        }).finally(()=>{
          setLoader(false);
          });
    }
  };
  return (<ThemedView style={styles.container}>
    <ThemedText style={styles.title}>Login</ThemedText>
    <TextInput
      style={styles.input}
      placeholder="NIC"
      value={nic}
      onChangeText={setNic}
      keyboardType="default"
    />
    <TextInput
      style={styles.input}
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
  </ThemedView>);
};

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: "center", alignItems: "center", padding: 20,
  }, title: {
    fontSize: 24, fontWeight: "bold", marginBottom: 20,
  }, input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
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

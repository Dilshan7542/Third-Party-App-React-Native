import React, {useEffect, useState} from "react";
import {Alert, Button, StyleSheet, TextInput} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useRouter} from "expo-router";
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import {useSelector,useDispatch} from "react-redux";
import {AppDispatch, RootState} from "@/store/Store";
import {userLoginAsync} from "@/store/user/UserAction";

const LoginScreen = () => {
  const useStore = useSelector((store:RootState)=> store.user);
  const tokenStore = useSelector((store:RootState)=> store.auth);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    checkUserIfExist();
  }, []);
  const checkUserIfExist = async () => {
    if (tokenStore.token) {
      navigation.push({pathname: "/pages/dashboard"});
    } else {
      await AsyncStorage.clear();
    }
  }
  const [nic, setNic] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useRouter();
  const handleLogin = () => {
    if (!nic || !password) {
      Alert.alert("Error", "Please fill out all fields!");
    } else {
        dispatch(userLoginAsync({nic,password})).then(res=>{
          navigation.push({pathname: "/pages/dashboard"});
        }).catch(error=>{
         alert("Error 500")
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
    <Button title="Login" onPress={handleLogin}/>
  </ThemedView>);
};

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5", padding: 20,
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
});

export default LoginScreen;

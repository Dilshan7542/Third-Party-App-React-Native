import {ThemedView} from "@/components/ThemedView";
import {StyleSheet, TouchableOpacity, StatusBar, View} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useRouter} from "expo-router";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/store/Store";
import {userLogout} from "@/store/user/UserAction";
import {IUser} from "@/store/user/UserReducer";
import {useEffect, useState} from "react";

interface Header {
  user:IUser | undefined
}
const AppHeader=(header:Header)=>{
  const navigation = useRouter();
  const [user, setUser] = useState<IUser |undefined>(undefined)
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    setUser(header.user);
  }, []);
  const logOut=async ()=>{
   dispatch(userLogout());
      navigation.push({pathname:"/pages/login"});
  }
  return (<ThemedView style={{paddingTop:StatusBar.currentHeight}} lightColor={"black"} darkColor={"white"}>
<ThemedView style={style.container} lightColor={"black"} darkColor={"white"}>
  <View style={{display:"flex",justifyContent:"center"}}>
    {user ?
  <ThemedText lightColor={"white"} darkColor={"black"} style={{paddingLeft:10}}>{user.name}</ThemedText>:
  <ThemedText lightColor={"white"} darkColor={"black"} style={{paddingLeft:10}}>{"Demo User"}</ThemedText>
    }
  </View>
  <TouchableOpacity onPress={logOut}>
<ThemedText lightColor={"white"} darkColor={"black"} style={{padding:10}}>LogOut</ThemedText>
  </TouchableOpacity>
</ThemedView>
  </ThemedView>);

}

const style=StyleSheet.create({
container:{
  display:"flex",
  flexDirection:"row",
  justifyContent:"space-between",
  width:"100%",
  height:50,



}

});

export default AppHeader;

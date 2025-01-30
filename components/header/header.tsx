import {ThemedView} from "@/components/ThemedView";
import {StyleSheet, TouchableOpacity, StatusBar, View} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useRouter} from "expo-router";

interface Header {
  name:string
}
const AppHeader=(header:Header)=>{
  const navigation = useRouter();
  const logOut=()=>{
    AsyncStorage.clear().then(()=>{
      navigation.push({pathname:"/pages/login"});
    });
  }
  return (<ThemedView style={{paddingTop:StatusBar.currentHeight}} lightColor={"black"} darkColor={"white"}>
<ThemedView style={style.container} lightColor={"black"} darkColor={"white"}>
  <View style={{display:"flex",justifyContent:"center"}}>
  <ThemedText lightColor={"white"} darkColor={"black"} style={{paddingLeft:10}}>{header.name}</ThemedText>
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

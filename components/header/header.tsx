import {ThemedView} from "@/components/ThemedView";
import {ColorSchemeName, StatusBar, StyleSheet, Switch, TouchableOpacity, View} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import {useRouter} from "expo-router";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store/Store";
import {userLogout} from "@/store/user/UserAction";
import {IUser} from "@/store/user/UserReducer";
import {useEffect, useState} from "react";
import {themeColorAction} from "@/store/preference/PreferenceAction";

export interface Props {
  themeFn: (theme: ColorSchemeName) => void
}

const AppHeader = () => {
  const navigation = useRouter();
  const [user, setUser] = useState<IUser | undefined>(undefined)
  const dispatch = useDispatch<AppDispatch>();
  const userStore = useSelector((store: RootState) => store.user);
  const [isDarkTheme, setDarkTheme] = useState(false);
  useEffect(() => {
    setUser(userStore.user);
  }, [userStore]);
  const toggleSwitch = () => setDarkTheme(theme => {
    if (theme) {
      dispatch(themeColorAction("light"));
    } else {
      dispatch(themeColorAction("dark"));
    }
    return !theme;
  });
  const logOut = async () => {
    dispatch(userLogout());
    navigation.push({pathname: "/pages/login"});
  }
  return (<ThemedView style={{paddingTop: StatusBar.currentHeight}} lightColor={"dark"} darkColor={"white"}>
    <ThemedView style={style.container} lightColor={"black"} darkColor={"white"}>
      <View style={{display: "flex", justifyContent: "center"}}>
        {user ?
          <ThemedText lightColor={"white"} darkColor={"black"} style={{paddingLeft: 10}}>{user.name}</ThemedText> :
          <ThemedText lightColor={"white"} darkColor={"black"} style={{paddingLeft: 10}}>{"Demo User"}</ThemedText>
        }
      </View>
      <View
        style={{display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "row", gap: 10}}>
        <TouchableOpacity onPress={logOut}>
          <ThemedText lightColor={"white"} darkColor={"black"} style={{}}>LogOut</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isDarkTheme ? '#111107' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isDarkTheme}
          />
        </TouchableOpacity>
      </View>
    </ThemedView>
  </ThemedView>);

}

const style = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: 50,


  }

});

export default AppHeader;

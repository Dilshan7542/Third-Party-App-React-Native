import React, {useEffect} from "react";
import { useSelector } from "react-redux";
import { View, ActivityIndicator } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import {RootState} from "@/store/Store";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface PrivateRouteProps {
  component: React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  useEffect(() => {
    isUserExist();
  }, []);
  async function isUserExist() {
    const token = await AsyncStorage.getItem("token");
    if (token === null) {
      navigation.navigate("/app/pages/login");
      return <View><ActivityIndicator size="large" /></View>;
    }
  }
  return <Component />;
};

export default PrivateRoute;

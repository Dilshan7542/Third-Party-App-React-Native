import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {IUser, UserState} from "./UserReducer";
import {userLogin} from "@/service/user-service";
import {ResponseCode} from "@/constants/ResponseCode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useRouter} from "expo-router";
const navigation = useRouter();
export const userInit= createAction("[USER] INIT");
export const userLoginSuccess= createAction<IUser>("[USER] LOGIN_SUCCESS");
export const userLogout= createAction("[USER] LOGOUT");
export const userSave= createAction<UserState>("[USER] SAVE");
export const userUpdate= createAction<UserState>("[USER] UPDATE");
export const userDelete= createAction<string>("[USER] DELETE");



// Define an async action
export const userLoginAsync = createAsyncThunk<IUser,{
  "nic": string,
  "password": string
}>(
  "[USER] LOGIN",
  async (userCredential, { rejectWithValue }) => {
    try {
      const response = await userLogin(userCredential);
      if (response.status === ResponseCode.SUCCESS) {
        await AsyncStorage.setItem("token", response.content.access_token);
        const user:IUser={
          id:new Date().toString()+":user",
          nic:response.content.nic,
          name:response.content.name || "Dev User"
        }
        navigation.push({pathname: "/pages/[id]", params: {nic: user.nic, id: user.id,name:user.name}});
        return user;
        }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


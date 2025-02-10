import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {IUser, UserState} from "./UserReducer";
import {userLogin} from "@/service/user-service";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {SUCCESS} from "@/constants/ResponseCode";
import {authAddToken} from "@/store/auth/AuthAction";
export const userInit= createAction("[USER] INIT");
export const userLoginSuccess= createAction<IUser>("[USER] LOGIN_SUCCESS");
export const userLogout= createAction("[USER] LOGOUT");
export const userSave= createAction<UserState>("[USER] SAVE");
export const userUpdate= createAction<UserState>("[USER] UPDATE");
export const userDelete= createAction<string>("[USER] DELETE");
export const loadingStatus=createAction<boolean>("[USER LOADING]");


// Define an async action
export const userLoginAsync = createAsyncThunk<IUser,{
  "nic": string,
  "password": string
}>(
  "[USER] LOGIN",
  async (userCredential, { rejectWithValue ,dispatch}) => {
    try {
      const response = await userLogin(userCredential);
      if (response.status === SUCCESS) {
        dispatch(authAddToken(response.content.access_token));
        const user:IUser={
          id:new Date().toString()+":user",
          nic:response.content.nic || "200001803909",
          name:response.content.name || "Dev User"
        }
        return user;
        }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


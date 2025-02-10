import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {IUser} from "@/store/user/UserReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const authAddToken= createAction<string | undefined>("[Auth] ADD_TOKEN");
export const setAuthPushId= createAction<string>("[Auth] ADD_PUSH_ID");
export const authRemoveToken= createAction("[Auth] REMOVE_TOKEN");

import { createReducer} from "@reduxjs/toolkit";
import  * as userAction from "./UserAction"
import {AppError} from "@/store/Store";
export interface IUser {
    id: string,
    name:string,
    nic: string
}
export interface UserState{
    user?:IUser,
    loading?:boolean,
    error?:AppError
}
const init:UserState={
}

export const userReducer = createReducer(init,(stateBuilder)=>{
stateBuilder
    .addCase(userAction.userInit,state=>state)
    .addCase(userAction.userLoginAsync.fulfilled,(_state,action)=>{
        return {
            ...init,
            user:action.payload
        }
    })
    .addCase(userAction.userLogout,()=> init)
    .addCase(userAction.userSave,(_state, action)=> action.payload);


});

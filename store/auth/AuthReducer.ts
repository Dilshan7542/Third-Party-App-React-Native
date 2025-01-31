import {createReducer} from "@reduxjs/toolkit";
import {authAddToken, setAuthPushId, authRemoveToken} from "@/store/auth/AuthAction";
import * as userAction from "@/store/user/UserAction";



export interface AuthState{
  token?:string,
  pushId?:string
}
const init:AuthState={};

export const authReducer= createReducer(init,(stateBuilder)=>{
  stateBuilder.addCase(authAddToken,(state, action)=>{
    return{
      ...state,
      token:action.payload
    }
  }).addCase(setAuthPushId,(state, action)=> {
      return {
        ...state,
        pushId:action.payload
      }
    })
    .addCase(userAction.userLogout,()=> init)
    .addCase(authRemoveToken,(state, action)=> init)
})

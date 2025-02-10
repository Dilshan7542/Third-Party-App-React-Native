import {createReducer} from "@reduxjs/toolkit";
import {authAddToken, setAuthPushId, authRemoveToken} from "@/store/auth/AuthAction";
import * as userAction from "@/store/user/UserAction";
import {state} from "sucrase/dist/types/parser/traverser/base";



export interface AuthState{
  token?:string,
  pushId:string
}
const init:AuthState={
  pushId:"init"
};

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
    .addCase(userAction.userLogout,(state, action)=>  {
      return {
       ...init,
        pushId:state.pushId
      }
    })
    .addCase(authRemoveToken,(state, action)=> init)
})

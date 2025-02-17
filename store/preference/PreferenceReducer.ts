import {createReducer} from "@reduxjs/toolkit";
import {Appearance, ColorSchemeName} from "react-native";
import getColorScheme = Appearance.getColorScheme;
import {useColorScheme} from "@/hooks/useColorScheme";
import {themeColorAction} from "@/store/preference/PreferenceAction";
export interface PreferenceState{
  theme:ColorSchemeName
}
const init:PreferenceState={
  theme:"light"
}
export const preferenceReducer=createReducer(init,(stateBuilder)=>{
   stateBuilder.addCase(themeColorAction,(state, action)=>{
     return {
       ...state,
       theme:action.payload
     }
   })
})

import {createAction} from "@reduxjs/toolkit";
import {ColorSchemeName} from "react-native";

 export const themeColorAction=createAction<ColorSchemeName>("[PREFERENCE] THEME")

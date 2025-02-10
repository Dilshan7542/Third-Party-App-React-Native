import {combineReducers, configureStore} from '@reduxjs/toolkit'
import {userReducer} from "./user/UserReducer";
import {persistReducer, persistStore} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {authReducer} from "@/store/auth/AuthReducer";
import {checkoutReducer} from "@/store/checkout/CheckoutReducer";
import {preferenceReducer} from "@/store/preference/PreferenceReducer";

export type AppError = {
  message: string,
  title: string
}
const persistConfig = {
  key: "root", // Key for storage
  storage: AsyncStorage,
  whitelist: ["user", "auth"],
};
const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  checkout: checkoutReducer,
  preference:preferenceReducer
});
// 🔹 Create Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

import {combineReducers, configureStore} from '@reduxjs/toolkit'
import {userReducer, UserState} from "./user/UserReducer";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
export type AppError={
  message:string,
  title:string
}
const persistConfig = {
    key: "root", // Key for storage
    storage: AsyncStorage, // Use AsyncStorage for React Native
};
const rootReducer = combineReducers({
    user: userReducer
});
// 🔹 Create Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store=configureStore({
    reducer:persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
          serializableCheck: false,
      }),
})
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

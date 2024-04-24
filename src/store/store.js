import { combineReducers, configureStore } from "@reduxjs/toolkit";
import meDataReducer from "./Reducer/meDataReducer";
import storage from "redux-persist/lib/storage";
import userDataReducer from "./Reducer/userDataReducer";
import { persistReducer, persistStore } from "redux-persist";
const rootReducer = combineReducers({
  meData: meDataReducer,
  userData: userDataReducer,
});
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["meData", "userData"],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
});
export const persistor = persistStore(store);

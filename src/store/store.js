import { combineReducers, configureStore } from "@reduxjs/toolkit";
import meDataReducer from "./Reducer/meDataReducer";
import storage from "redux-persist/lib/storage";
import userDataReducer from "./Reducer/userDataReducer";
import selectedUserReducer from "./Reducer/selectedUserReducer";
import { persistReducer, persistStore } from "redux-persist";
const rootReducer = combineReducers({
  meData: meDataReducer,
  userData: userDataReducer,
  selectedUser: selectedUserReducer,
});
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["meData", "selectedUser"],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
});
export const persistor = persistStore(store);

import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  displayName: null,
  email: null,
  photoURL: null,
  uid: null,
  accessToken: null,
};
const { reducer, actions } = createSlice({
  name: "meDataReducer",
  initialState,
  reducers: {
    storeMeData: (state, action) => {
      return action.payload;
    },
    resetMeData: (state) => {
      return initialState;
    },
  },
});
export default reducer;
export const { storeMeData, resetMeData } = actions;

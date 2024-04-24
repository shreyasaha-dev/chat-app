import { createSlice } from "@reduxjs/toolkit";
const initialState = null;
const { reducer, actions } = createSlice({
  name: "userDataReducer",
  initialState,
  reducers: {
    storeUserData: (state, action) => {
      return action.payload;
    },
  },
});
export default reducer;
export const { storeUserData } = actions;

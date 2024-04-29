import { createSlice } from "@reduxjs/toolkit";
const initialState = { uid: null, details: null };
const { reducer, actions } = createSlice({
  name: "selectedUserReducer",
  initialState,
  reducers: {
    storeSelectedUid: (state, action) => {
      state.uid = action.payload;
    },
    storeSelectedDetails: (state, action) => {
      state.details = action.payload;
    },
    resetSelectedUser: (state, action) => {
      return initialState;
    },
  },
});
export default reducer;
export const { storeSelectedUid, storeSelectedDetails, resetSelectedUser } =
  actions;

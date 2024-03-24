import { createSlice } from "@reduxjs/toolkit";
const ReduxSlice = createSlice({
  name: "ReduxSlice",
  initialState: {
    userID: localStorage.getItem("userID")
      ? localStorage.getItem("userID")
      : [],
    Token: localStorage.getItem("Token")
      ? localStorage.getItem("Token")
      : "",
  },
  reducers: {
    UserLoggedIn(state, action) {
      state.userID = action.payload.userID;
      state.Token = action.payload.Token;
      localStorage.setItem("userID", state.userID);
      localStorage.setItem("Token", state.Token);
    },
    UserLoggedOut() {
      localStorage.removeItem("userID");
      localStorage.removeItem("Token");
    },
  },
});
export const { UserLoggedIn, UserLoggedOut } = ReduxSlice.actions;
export default ReduxSlice.reducer;

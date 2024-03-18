import { createSlice } from "@reduxjs/toolkit";
const ReduxSlice = createSlice({
  name: "ReduxSlice",
  initialState: {
    userID: sessionStorage.getItem("userID")
      ? sessionStorage.getItem("userID")
      : [],
    Token: sessionStorage.getItem("Token")
      ? sessionStorage.getItem("Token")
      : "",
  },
  reducers: {
    UserLoggedIn(state, action) {
      state.userID = action.payload.userID;
      state.Token = action.payload.Token;
      sessionStorage.setItem("userID", state.userID);
      sessionStorage.setItem("Token", state.Token);
    },
    UserLoggedOut() {
      sessionStorage.removeItem("userID");
      sessionStorage.removeItem("Token");
    },
  },
});
export const { UserLoggedIn, UserLoggedOut } = ReduxSlice.actions;
export default ReduxSlice.reducer;

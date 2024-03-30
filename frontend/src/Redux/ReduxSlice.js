import { createSlice } from "@reduxjs/toolkit";
const ReduxSlice = createSlice({
  name: "ReduxSlice",
  initialState: {
    instaUserID: localStorage.getItem("instaUserID")
      ? localStorage.getItem("instaUserID")
      : [],
    instaTOKEN: localStorage.getItem("instaTOKEN")
      ? localStorage.getItem("instaTOKEN")
      : "",
  },
  reducers: {
    UserLoggedIn(state, action) {
      state.instaUserID = action.payload.userID;
      state.instaTOKEN = action.payload.Token;
      localStorage.setItem("instaUserID", state.instaUserID);
      localStorage.setItem("instaTOKEN", state.instaTOKEN);
    },
    UserLoggedOut() {
      localStorage.removeItem("instaUserID");
      localStorage.removeItem("instaTOKEN");
      localStorage.removeItem("instaUserName");
    },
  },
});
export const { UserLoggedIn, UserLoggedOut } = ReduxSlice.actions;
export default ReduxSlice.reducer;

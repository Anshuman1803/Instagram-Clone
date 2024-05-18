import { createSlice } from "@reduxjs/toolkit";
const ReduxSlice = createSlice({
  name: "ReduxSlice",
  initialState: {
      profileImage: localStorage.getItem("profileImage") ? localStorage.getItem("profileImage") : "",
      instaUserID: localStorage.getItem("instaUserID")? localStorage.getItem("instaUserID"): [],
      instaTOKEN: localStorage.getItem("instaTOKEN") ? localStorage.getItem("instaTOKEN"): "",
      instaUserName: localStorage.getItem("instaUserName")? localStorage.getItem("instaUserName"): "",
      instaProfle: localStorage.getItem("instaProfle")? localStorage.getItem("instaProfle"): "",
      instaFullName: localStorage.getItem("instaFullName")? localStorage.getItem("instaFullName"): "",
  },
  reducers: {
    UserLoggedIn(state, action) {
      state.instaUserID = action.payload.userID;
      state.instaTOKEN = action.payload.Token;
      state.instaUserName = action.payload.userName;
      state.instaProfle = action.payload.userProfile;
      state.instaFullName = action.payload.userFullName;
      localStorage.setItem("instaUserID", state.instaUserID);
      localStorage.setItem("instaTOKEN", state.instaTOKEN);
      localStorage.setItem("instaUserName", state.instaUserName);
      localStorage.setItem("instaProfle", state.instaProfle);
      localStorage.setItem("instaFullName", state.instaFullName);
    },
    UserLoggedOut(state) {
      state.instaUserID = '';
      state.instaTOKEN = '';
      state.instaUserName = '';
      state.instaProfle = '';
      state.instaFullName = '';
      localStorage.clear()
    },
  },
});
export const { UserLoggedIn, UserLoggedOut } = ReduxSlice.actions;
export default ReduxSlice.reducer;

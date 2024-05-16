import { createSlice } from "@reduxjs/toolkit";
const ReduxSlice = createSlice({
  name: "ReduxSlice",
  initialState: {
      profileImage: localStorage.getItem("profileImage") ? localStorage.getItem("profileImage") : "",
      instaUserID: localStorage.getItem("instaUserID")? localStorage.getItem("instaUserID"): [],
      instaTOKEN: localStorage.getItem("instaTOKEN") ? localStorage.getItem("instaTOKEN"): "",
      instaUserName: localStorage.getItem("instaUserName")? localStorage.getItem("instaUserName"): "",
      instaProfle: localStorage.getItem("instaProfle")? localStorage.getItem("instaProfle"): "",
  },
  reducers: {
    UserLoggedIn(state, action) {
      state.instaUserID = action.payload.userID;
      state.instaTOKEN = action.payload.Token;
      state.instaUserName = action.payload.userName;
      state.instaProfle = action.payload.userProfile;
      localStorage.setItem("instaUserID", state.instaUserID);
      localStorage.setItem("instaTOKEN", state.instaTOKEN);
      localStorage.setItem("instaUserName", state.instaUserName);
      localStorage.setItem("instaProfle", state.instaProfle);
    },
    UserLoggedOut(state) {
      state.instaUserID = '';
      state.instaTOKEN = '';
      state.instaUserName = '';
      state.instaProfle = '';
      localStorage.clear()
    },
  },
});
export const { UserLoggedIn, UserLoggedOut } = ReduxSlice.actions;
export default ReduxSlice.reducer;

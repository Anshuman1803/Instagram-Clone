import { createSlice } from "@reduxjs/toolkit";
const ReduxSlice = createSlice({
  name: "ReduxSlice",
  initialState: {
    instaUserID: localStorage.getItem("instaUserID") ? localStorage.getItem("instaUserID") : "",
    instaTOKEN: localStorage.getItem("instaTOKEN") ? localStorage.getItem("instaTOKEN") : "",
    instaUserName: localStorage.getItem("instaUserName") ? localStorage.getItem("instaUserName") : "",
    instaProfle: localStorage.getItem("instaProfle") ? localStorage.getItem("instaProfle") : "",
    instaFullName: localStorage.getItem("instaFullName") ? localStorage.getItem("instaFullName") : "",
    instaSavedPost: localStorage.getItem("instaSavedPost") ? JSON.parse(localStorage.getItem("instaSavedPost")) : [],
  },
  reducers: {

    UserLoggedIn(state, action) {
      state.instaUserID = action.payload.userID;
      state.instaTOKEN = action.payload.Token;
      state.instaUserName = action.payload.userName;
      state.instaProfle = action.payload.userProfile;
      state.instaFullName = action.payload.userFullName;
      state.instaSavedPost = action.payload.savedPost;
      localStorage.setItem("instaUserID", state.instaUserID);
      localStorage.setItem("instaTOKEN", state.instaTOKEN);
      localStorage.setItem("instaUserName", state.instaUserName);
      localStorage.setItem("instaProfle", state.instaProfle);
      localStorage.setItem("instaFullName", state.instaFullName);
      localStorage.setItem("instaSavedPost", JSON.stringify(state.instaSavedPost));
    },

    userSavePost(state, action) {
      state.instaSavedPost = [...state.instaSavedPost, action.payload];
      localStorage.setItem("instaSavedPost", JSON.stringify(state.instaSavedPost));
    },

    userRemoveSavePost(state, action) {
      const filterSavePost = state.instaSavedPost.filter((data) => data !== action.payload)
      state.instaSavedPost = filterSavePost
      localStorage.setItem("instaSavedPost", JSON.stringify(state.instaSavedPost));
    },

    userUpdateDetails(state, action) {
      state.instaUserName = action.payload.instaUserName ?? state.instaUserName;
      state.instaProfle = action.payload.instaProfle ?? state.instaProfle;
      state.instaFullName = action.payload.instaFullName ?? state.instaFullName;
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
      state.instaSavedPost = [];
      localStorage.removeItem("instaUserID");
      localStorage.removeItem("instaTOKEN");
      localStorage.removeItem("instaUserName");
      localStorage.removeItem("instaProfle");
      localStorage.removeItem("instaFullName");
      localStorage.removeItem("instaSavedPost");
    },

  },
});
export const { UserLoggedIn, UserLoggedOut, userSavePost, userRemoveSavePost, userUpdateDetails } = ReduxSlice.actions;
export default ReduxSlice.reducer;

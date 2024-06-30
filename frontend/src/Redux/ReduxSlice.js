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
    instaFollowing: localStorage.getItem("instaFollowing") ? JSON.parse(localStorage.getItem("instaFollowing")) : [],
    instaFollowers: localStorage.getItem("instaFollowers") ? JSON.parse(localStorage.getItem("instaFollowers")) : [],
    instaLikes: localStorage.getItem("instaLikes") ? JSON.parse(localStorage.getItem("instaLikes")) : [],
  },
  reducers: {
    UserLoggedIn(state, action) {
      state.instaUserID = action.payload.userID;
      state.instaTOKEN = action.payload.Token;
      state.instaUserName = action.payload.userName;
      state.instaProfle = action.payload.userProfile;
      state.instaFullName = action.payload.userFullName;
      state.instaSavedPost = action.payload.savedPost;
      state.instaFollowing = action.payload.userFollwing;
      state.instaFollowers = action.payload.userFollowers;
      state.instaLikes = action.payload.likedPost;
      localStorage.setItem("instaUserID", state.instaUserID);
      localStorage.setItem("instaTOKEN", state.instaTOKEN);
      localStorage.setItem("instaUserName", state.instaUserName);
      localStorage.setItem("instaProfle", state.instaProfle);
      localStorage.setItem("instaFullName", state.instaFullName);
      localStorage.setItem(
        "instaSavedPost",
        JSON.stringify(state.instaSavedPost)
      );
      localStorage.setItem(
        "instaFollowing",
        JSON.stringify(state.instaFollowing)
      );
      localStorage.setItem(
        "instaFollowers",
        JSON.stringify(state.instaFollowers)
      );
      localStorage.setItem("instaLikes", JSON.stringify(state.instaLikes));
    },

    userSavePost(state, action) {
      state.instaSavedPost = [...state.instaSavedPost, action.payload];
      localStorage.setItem(
        "instaSavedPost",
        JSON.stringify(state.instaSavedPost)
      );
    },

    userRemoveSavePost(state, action) {
      const filterSavePost = state.instaSavedPost.filter(
        (data) => data !== action.payload
      );
      state.instaSavedPost = filterSavePost;
      localStorage.setItem(
        "instaSavedPost",
        JSON.stringify(state.instaSavedPost)
      );
    },

    userFollow(state, action) {
      state.instaFollowing = [...state.instaFollowing, action.payload];
      localStorage.setItem(
        "instaFollowing",
        JSON.stringify(state.instaFollowing)
      );
    },

    userUnFollow(state, action) {
      const filterFollwing = state.instaFollowing.filter(
        (data) => data !== action.payload
      );
      state.instaFollowing = filterFollwing;
      localStorage.setItem(
        "instaFollowing",
        JSON.stringify(state.instaFollowing)
      );
    },

    userLikeUnlikePost(state, action) {
      if (action.payload.type === "like") {
        state.instaLikes = [...state.instaLikes, action.payload.postID];
        localStorage.setItem("instaLikes", JSON.stringify(state.instaLikes));
      } else {
        const filterData = state.instaLikes.filter((data) => data !== action.payload.postID);
        state.instaLikes = filterData;
        localStorage.setItem("instaLikes", JSON.stringify(state.instaLikes));
      }
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
      state.instaUserID = "";
      state.instaTOKEN = "";
      state.instaUserName = "";
      state.instaProfle = "";
      state.instaFullName = "";
      state.instaSavedPost = [];
      state.instaFollowing = [];
      state.instaFollowers = [];
      state.instaLikes = [];
      localStorage.removeItem("instaUserID");
      localStorage.removeItem("instaTOKEN");
      localStorage.removeItem("instaUserName");
      localStorage.removeItem("instaProfle");
      localStorage.removeItem("instaFullName");
      localStorage.removeItem("instaSavedPost");
      localStorage.removeItem("instaFollowing");
      localStorage.removeItem("instaFollowers");
      localStorage.removeItem("instaLikes");
    },
  },
});
export const {
  UserLoggedIn,
  UserLoggedOut,
  userSavePost,
  userRemoveSavePost,
  userUpdateDetails,
  userFollow,
  userUnFollow,
  userLikeUnlikePost
} = ReduxSlice.actions;
export default ReduxSlice.reducer;

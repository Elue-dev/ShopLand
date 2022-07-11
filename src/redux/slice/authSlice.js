import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  email: null,
  userID: null,
  userName: null,
  users: []
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SET_ACTIVE_USER: (state, action) => {
      const { email, userID, userName } = action.payload;
      state.isLoggedIn = true;
      state.email = email;
      state.userName = userName;
      state.userID = userID;
    },
    REMOVE_ACTIVE_USER: (state) => {
      state.isLoggedIn = false;
      state.email = null;
      state.userName = null;
      state.userID = null;
    },
    STORE_USERS: (state, action) => {
      state.users = action.payload
    }
  },
});

export const { SET_ACTIVE_USER, REMOVE_ACTIVE_USER, STORE_USERS } = authSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectEmail = (state) => state.auth.email;
export const selectUserName = (state) => state.auth.userName;
export const selectUserID = (state) => state.auth.userID;
export const selectUsers = (state) => state.auth.users;

export default authSlice.reducer;

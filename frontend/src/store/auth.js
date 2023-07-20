import { createSlice } from '@reduxjs/toolkit';

const initialAuthState = {
  token: 'null',
  isLoggedIn: false,
  email: null,
  role: null,
};

const authSlice = createSlice({
  name: 'user',
  initialState: initialAuthState,
  reducers: {
    authSuccess(state, action) {
      let response = action.payload.response;
      let oldState = state;
      state = {
        ...oldState,
        token: response.accessToken,
        isLoggedIn: true,
        email: response.email,
        role: response.role,
      };
      return state;
    },
    logout(state, action) {
      state = {
        token: 'null',
        isLoggedIn: false,
        email: null,
        role: null,
      };
      return state;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;

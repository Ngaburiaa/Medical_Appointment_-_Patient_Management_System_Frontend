import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface User {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  userId: number;
  profileURL?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  userType: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  userType: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        email: string;
        firstName: string;
        lastName: string;
        address: string;
        userId: number;
        token: string;
        userType: string;
        profileURL?: string;
      }>
    ) => {
      const {
        email,
        firstName,
        lastName,
        address,
        userId,
        token,
        userType,
        profileURL,
      } = action.payload;
      console.log("Payload:", action.payload);


      state.user = {
        email,
        firstName,
        lastName,
        address,
        userId,
        profileURL,
      };
      state.token = token;
      state.userType = userType;
      state.isAuthenticated = true;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.userType = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;

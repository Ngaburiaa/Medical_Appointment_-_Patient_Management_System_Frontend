
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../App/store';
import type { Doctor } from '../../types/types';

type LoginCredentials = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  userType: "admin" | "doctor" | "user";
  doctor?: Doctor; 
  message?: string;
};


export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/',
            prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        headers.set("Content-type","application/json")
        return headers;
      },
   }),
  tagTypes: ['users', 'user'],
  endpoints: (builder) => ({
    loginUser: builder.mutation<LoginResponse, LoginCredentials>({
  query: (userLoginCredentials) => ({
    url: 'login',
    method: 'POST',
    body: userLoginCredentials,
  }),
}),

    registerUser: builder.mutation({
      query: (userRegisterPayload)=> ({
        url: 'register',
        method: 'POST',
        body: userRegisterPayload,
      }),
    }),
    getUserById: builder.query({
      query: (user_id: number) => `users/${user_id}`,
      providesTags: ["user",]
    }),
    getUsersProfiles: builder.query({
      query: () => 'users',
      providesTags: ["users"]
    }),
    getUserProfile: builder.query({
      query: (userId: number) => `users/${userId}`,  
      providesTags: ["user"]    
    }),
    updateUserProfile: builder.mutation({
      query: ({ user_id, ...patch }) => ({
        url: `users/${user_id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ["user", "users"]
    }),


  updateUserProfileImage: builder.mutation({
    query: ({ user_id, profile_picture }) => ({
      url: `users/${user_id}`,
      method: 'PUT',
      body: { profile_picture },
    }),
    invalidatesTags: ["user", "users"]
  }),

 
    deleteUserProfile: builder.mutation({
      query: (user_id) => ({
        url: `users/${user_id}`,
        method: 'DELETE',
      }),
  }),
}),
});




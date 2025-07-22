
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../App/store';

export const complaintApi = createApi({
  reducerPath: 'complaintApi',
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
  tagTypes: ['complaints', 'complaint'],
  endpoints: (builder) => ({
    
    createComplaint: builder.mutation({
      query: (complaintPayload)=> ({
        url: 'complaints',
        method: 'POST',
        body: complaintPayload,
      }),
    }),


       getComplaintById: builder.query({
      query: (complaint_id: number) => `complaints/${complaint_id}`,
      providesTags: ["complaint",]
    }),


    getComplaintsProfiles: builder.query({
      query: () => 'complaints',
      providesTags: ["complaints"]
    }),

 
    updateComplaintProfile: builder.mutation({
      query: ({ complaint_id, ...patch }) => ({
        url: `complaints/${complaint_id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ["complaint", "complaints"]
    }),


   
    deleteComplaintById: builder.mutation({
      query: (complaint_id) => ({
        url: `complaints/${complaint_id}`,
        method: 'DELETE',
      }),
  }),
}),
});




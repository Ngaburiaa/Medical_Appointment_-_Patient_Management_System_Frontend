import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../App/store';

export const appointmentApi = createApi({
  reducerPath: 'appointmentApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://medical-appointment-patient-management.onrender.com/api/',
        prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        headers.set("Content-type","application/json")
        return headers;
      },
   }),



  tagTypes: ['appointments', 'appointment'],
  endpoints: (builder) => ({
    createAppoinment: builder.mutation({
      query: (appointmentLoginCredentials ) => ({
        url: 'appointments',
        method: 'POST',
        body: appointmentLoginCredentials,
      }),
      invalidatesTags:['appointments']
    }),

     


       getAppointmentById: builder.query({
      query: (appointment_id: number) => `appointments/${appointment_id}`,
      providesTags: ["appointment",]
    }),

   
    getAppointmentsProfiles: builder.query({
      query: () => 'appointments',
      providesTags: ["appointments"]
    }),


    getAppointmentProfile: builder.query({
      query: (appointmentId: number) => `appointments/${appointmentId}`,  
      providesTags: ["appointment"]    
    }),
    
    updateAppointmentProfile: builder.mutation({
      query: ({ appointment_id, ...patch }) => ({
        url: `appointments/${appointment_id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ["appointment", "appointments"]
    }),

    
  

    deleteAppointmentProfile: builder.mutation({
      query: (appointment_id) => ({
        url: `appointments/${appointment_id}`,
        method: 'DELETE',
      }),
      
  }),
}),
});



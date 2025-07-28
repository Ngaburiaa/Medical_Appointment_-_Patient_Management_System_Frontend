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


 createAppointment: builder.mutation<{
  appointmentId: number;
  totalAmount: string;
}, {
  userId: number;
  doctorId: number;
  appointmentDate: string;
  timeSlot: string;
  totalAmount: string;
}>({
  query: (appointmentData) => ({
    url: 'appointments',
    method: 'POST',
    body: appointmentData,
  }),

transformResponse: (newAppointment: any) => {

  if (newAppointment.appointmentId) {
    return {
      appointmentId: newAppointment.appointmentId,
      totalAmount: newAppointment.totalAmount
    };
  }

  else if (newAppointment.appointment) {
    return {
      appointmentId: newAppointment.appointment.appointmentId,
      totalAmount: newAppointment.appointment.totalAmount
    };
  }
  // Fallback
  return newAppointment;
},
  invalidatesTags: ['appointments'],
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


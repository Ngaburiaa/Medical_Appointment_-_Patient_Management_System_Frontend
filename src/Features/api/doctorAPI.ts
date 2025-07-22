import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Doctor {
  doctorId: number;
  specialization: string;
  bio: string;
  availableDays: string;
  user: {
    userId: number;
    firstName: string;
    lastName: string;
    address: string;
    profileURL?: string | null;
     };
  appointments: {
    appointmentId: number;
    userId: number;
    appointmentDate: string;
    timeSlot: string;
    appointmentStatus: string;
    totalAmount: string;
    
  }[];
  prescriptions: {
    prescriptionId: number;
    userId: number;
    doctorId: number;
    medication: string;
    dosage: string;
    issuedDate: string;
  }[];
}


export const doctorApi = createApi({
  reducerPath: 'doctorApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/'
   }),
  tagTypes: ['doctors', 'doctor'],
  endpoints: (builder) => ({
        getAllDoctors: builder.query({
        query: () => ({
            url: '/doctors',
            method: 'GET',
        }),
        }),

     getdoctorById: builder.query({
      query: (doctor_id: number) => `doctors/${doctor_id}`,
      providesTags: ["doctor",]
    }),

    getdoctorsProfiles: builder.query({
      query: () => 'doctors',
      providesTags: ["doctors"]
    }),

 
    updatedoctorProfile: builder.mutation({
      query: ({ doctor_id, ...patch }) => ({
        url: `doctors/${doctor_id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ["doctor", "doctors"]
    }),

  

  updatedoctorProfileImage: builder.mutation({
    query: ({ doctor_id, profile_picture }) => ({
      url: `doctors/${doctor_id}`,
      method: 'PUT',
      body: { profile_picture },
    }),
    invalidatesTags: ["doctor", "doctors"]
  }),
    deletedoctorProfile: builder.mutation({
      query: (doctor_id) => ({
        url: `doctors/${doctor_id}`,
        method: 'DELETE',
      }),
  }),
}),
});



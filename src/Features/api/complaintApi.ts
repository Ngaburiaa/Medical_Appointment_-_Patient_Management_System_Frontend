import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../App/store';

export const complaintApi = createApi({
  reducerPath: 'complaintApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://medical-appointment-patient-management.onrender.com/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-type", "application/json");
      return headers;
    },
  }),
  tagTypes: ['Complaint', 'Complaints'],
  endpoints: (builder) => ({
    createComplaint: builder.mutation({
      query: (complaintPayload) => ({
        url: 'complaints',
        method: 'POST',
        body: complaintPayload,
      }),
      invalidatesTags: ['Complaints'],
    }),

    getComplaintById: builder.query({
      query: (complaintId: number) => `complaints/${complaintId}`,
      providesTags: (_result, _error, complaintId) => [{ type: 'Complaint', id: complaintId }],
    }),

    getComplaintsProfiles: builder.query({
      query: () => 'complaints',
      providesTags: ['Complaints'],
    }),

    updateComplaintProfile: builder.mutation({
      query: ({ complaintId, ...patch }) => ({
        url: `complaints/${complaintId}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { complaintId }) => [
        { type: 'Complaint', id: complaintId },
        'Complaints'
      ],
    }),

    deleteComplaintById: builder.mutation({
      query: (complaintId) => ({
        url: `complaints/${complaintId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Complaints'],
    }),
  }),
});


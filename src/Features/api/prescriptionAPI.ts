import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../App/store';

export const prescriptionApi = createApi({
  reducerPath: 'prescriptionApi',
  baseQuery: fetchBaseQuery({
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        headers.set("Content-type","application/json")
        return headers;
      },
  }),
  tagTypes: ['Prescription', 'Prescriptions'],
  endpoints: (builder) => ({
    // ✅ Create prescription
    createPrescription: builder.mutation({
      query: (newPrescription) => ({
        url: 'prescriptions',
        method: 'POST',
        body: newPrescription,
      }),
      invalidatesTags: ['Prescriptions'],
    }),

    // ✅ Get all prescriptions
    getPrescriptions: builder.query({
      query: () => 'prescriptions',
      providesTags: ['Prescriptions'],
    }),

    // ✅ Get prescription by ID (detailed view)
    getPrescriptionById: builder.query({
      query: (prescriptionId: number) => `prescriptions/${prescriptionId}`,
      providesTags: (_result, _error, id) => [{ type: 'Prescription', id }],
    }),

   
    // ✅ Update prescription
    updatePrescription: builder.mutation({
      query: ({ prescriptionId, ...patch }) => ({
        url: `prescriptions/${prescriptionId}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { prescriptionId }) => [
        { type: 'Prescription', id: prescriptionId },
        'Prescriptions',
      ],
    }),

    // ✅ Delete prescription
    deletePrescription: builder.mutation({
      query: (prescriptionId: number) => ({
        url: `prescriptions/${prescriptionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Prescription', id },
        'Prescriptions',
      ],
    }),
  }),
});
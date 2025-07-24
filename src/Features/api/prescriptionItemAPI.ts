import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../App/store';

export const prescriptionItemApi = createApi({
  reducerPath: 'prescriptionItemApi',
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



  tagTypes: ['prescriptionItems', 'prescriptionItem'],
  endpoints: (builder) => ({
    createPrescriptionItem: builder.mutation({
      query: (prescriptionItemLoginCredentials ) => ({
        url: 'prescription-items',
        method: 'POST',
        body: prescriptionItemLoginCredentials,
      }),
      invalidatesTags:['prescriptionItems']
    }),

     


       getPrescriptionItemById: builder.query({
      query: (prescriptionItem_id: number) => `prescription-items/${prescriptionItem_id}`,
      providesTags: ["prescriptionItem",]
    }),

   
    getPrescriptionItemsProfiles: builder.query({
      query: () => 'prescription-items',
      providesTags: ["prescriptionItems"]
    }),


    getPrescriptionItemProfile: builder.query({
      query: (prescriptionItemId: number) => `prescription-items/${prescriptionItemId}`,  
      providesTags: ["prescriptionItem"]    
    }),
    
    updatePrescriptionItemProfile: builder.mutation({
      query: ({ prescriptionItem_id, ...patch }) => ({
        url: `prescription-items/${prescriptionItem_id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ["prescriptionItem", "prescriptionItems"]
    }),

    
  

    deletePrescriptionItemProfile: builder.mutation({
      query: (prescriptionItem_id) => ({
        url: `prescription-items/${prescriptionItem_id}`,
        method: 'DELETE',
      }),
      
  }),
}),
});



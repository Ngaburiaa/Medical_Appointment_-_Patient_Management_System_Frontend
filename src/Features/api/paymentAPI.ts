import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../App/store';

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
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



  tagTypes: ['payments', 'payment'],
  endpoints: (builder) => ({
    createPayment: builder.mutation({
      query: (paymentCredentials ) => ({
        url: 'payments',
        method: 'POST',
        body: paymentCredentials,
      }),
      invalidatesTags:['payments']
    }),

     


       getPaymentById: builder.query({
      query: (payment_id: number) => `payments/${payment_id}`,
      providesTags: ["payment",]
    }),

   
    getPaymentsProfiles: builder.query({
      query: () => 'payments',
      providesTags: ["payments"]
    }),


    getPaymentProfile: builder.query({
      query: (paymentId: number) => `payments/${paymentId}`,  
      providesTags: ["payment"]    
    }),
    
    updatePaymentProfile: builder.mutation({
      query: ({ payment_id, ...patch }) => ({
        url: `payments/${payment_id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ["payment", "payments"]
    }),

    
  

    deletePaymentProfile: builder.mutation({
      query: (payment_id) => ({
        url: `payments/${payment_id}`,
        method: 'DELETE',
      }),
      
  }),
}),
});



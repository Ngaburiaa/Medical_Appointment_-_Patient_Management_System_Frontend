import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

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

interface AuthState {
  doctor: Doctor | null;
  doctorId:number
}

const initialState: AuthState = {
    doctor: null,
    doctorId: 0
};

const docAuthSlice = createSlice({
  name: 'docAuth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<Doctor>) => {
      state.doctor = action.payload;
     state.doctorId = action.payload.doctorId;
     
    },
    clearCredentials: (state) => {
      state.doctor = null;
    },
  },
});

export const { setCredentials, clearCredentials } = docAuthSlice.actions;
export default docAuthSlice.reducer;

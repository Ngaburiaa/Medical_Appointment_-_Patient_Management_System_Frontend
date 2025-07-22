export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  contactPhone: string;
  profileURL: string | null;
  address: string;
  userType: string;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor1 {
  doctorId: number;
  userId: number;
  specialization: string;
  bio: string;
  availableDays: string;
  createdAt: string;
  updatedAt: string;
}

export interface Prescription {
  prescriptionId: number;
  appointmentId: number;
  doctorId: number;
  patientId: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  paymentId: number;
  appointmentId: number;
  amount: string;
  paymentStatus: string;
  transactionId: string;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Complaint {
  complaintId: number;
  userId: number;
  relatedAppointmentId: number;
  subject: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  appointmentId: number;
  userId: number;
  doctorId: number;
  appointmentDate: string;
  timeSlot: string;
  totalAmount: string;
  appointmentStatus: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  doctor: Doctor;
  prescription: Prescription[];
  payments: Payment[];
  complaints: Complaint[];
}


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

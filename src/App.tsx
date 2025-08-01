import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from './pages/Home';
import  Error from './pages/Error'
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Contact } from './pages/Contact';
import { Appointments } from './Components/dashboard/Appointments';
import { Dashboard } from './Components/dashboard/DashBoard';
import { DoctorDashBoard } from './Components/doctorDashBoard/DoctorDashBoard';
import { Profile } from './Components/dashboard/Profile';
import { Main } from './Components/dashboard/Main';
import { Doctors } from './Components/dashboard/Doctors';
import { Prescriptions } from './Components/dashboard/Prescriptions';
import { Support } from './Components/dashboard/Support';
import { Settings } from './Components/dashboard/Settings';
import { Payments } from './Components/dashboard/Payments';
import { Schedule} from './Components/doctorDashBoard/Schedule';
import{UpcomingAppointments} from './Components/doctorDashBoard/UpComing'
import { Overview } from './Components/doctorDashBoard/Overview';
import { Patients } from './Components/doctorDashBoard/Patients';
import { DoctorPrescription } from './Components/doctorDashBoard/DoctorPrescription';
import { Notifications } from './Components/doctorDashBoard/Notifications';
import { DoctorPayment } from './Components/doctorDashBoard/DoctorPayment';
import { Analytics } from './Components/doctorDashBoard/Analytics';
import { DoctorProfile } from './Components/doctorDashBoard/Profile';
import { DoctorSettings } from './Components/doctorDashBoard/Settings';
import { AdminDashBoard } from './Components/AdminDashBoard/AdminDashBoard';
import { AdminOverview } from './Components/AdminDashBoard/AdminOverview';
import { AdminPatients } from './Components/AdminDashBoard/AdminPatients';
import { AdminAppointments } from './Components/AdminDashBoard/AdminAppointments';
import { AdminPrescriptions } from './Components/AdminDashBoard/AdminPrescriptions';
import { AdminProfile } from './Components/AdminDashBoard/AdminProfile';
import { AdminDoctors } from './Components/AdminDashBoard/AdminDoctors';
import { AdminPayments } from './Components/AdminDashBoard/AdminPayments';
import { AdminSupport } from './Components/AdminDashBoard/AdminSupport';
import { DoctorPage } from './pages/Doctors';
import ProtectedRoute from './Components/ProtectedRoute';



function App() {
   const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>,
      errorElement: <Error />,
    },
     {
      path: "/login",
      element: <Login />,
      errorElement: <Error />,
    },
     {
      path: "/register",
      element: <Register />,
      errorElement: <Error />,
    },
    {
      path: "/contact",
      element: <Contact/>,
      errorElement: <Error />,
    },
     {
      path: "/doctors",
      element: <DoctorPage/>,
      errorElement: <Error />,
    },
     {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
      errorElement: <Error />,
      children: [
         {
          path: "main",
          element: <Main/>,
        },
        {
          path: "appointments",
          element: <Appointments/>,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "doctors",
          element: <Doctors/>,
        },
        {
          path: "prescriptions",
          element: <Prescriptions/>,
        },
        {
          path: "payments",
          element: <Payments/>,
        },
        {
          path: "support",
          element: <Support/>,
        },
        {
          path: "settings",
          element: <Settings/>,
        },

      ]},

       {
      path: "/doctorDashBoard",
      element: (
        <ProtectedRoute>
          <DoctorDashBoard />
        </ProtectedRoute>
      ),
      errorElement: <Error />,
      children: [
         {
          path: "overview",
          element: <Overview/>,
        },
        {
          path: "upcoming",
          element: <UpcomingAppointments/>,
        },
        {
          path: "schedule",
          element: <Schedule/>,
        },
         {
          path: "patients",
          element: <Patients/>,
        },
        {
          path: "prescriptions",
          element: <DoctorPrescription/>,
        },
        {
          path: "notifications",
          element: <Notifications/>,
        },
        {
          path: "payments",
          element: <DoctorPayment/>,
        },
          {
          path: "analytics",
          element: <Analytics/>,
        },
          {
          path: "profile",
          element: <DoctorProfile/>,
        },
         {
          path: "settings",
          element: <DoctorSettings/>,
        },

        
              
      ]},

      {
      path: "/admin",
       element: (
        <ProtectedRoute>
          <AdminDashBoard />
        </ProtectedRoute>
      ),
      errorElement: <Error />,
      children: [
         {
          path: "overview",
          element: <AdminOverview/>,
        },
         {
          path: "patients",
          element: <AdminPatients/>,
        },
         {
          path: "appointments",
          element: <AdminAppointments/>,
        },
        {
          path: "prescriptions",
          element: <AdminPrescriptions/>,
        },
        {
          path: "profile",
          element: <AdminProfile/>,
        },
        {
          path: "doctors",
          element: <AdminDoctors/>,
        },
         {
          path: "payments",
          element: <AdminPayments/>,
        },
        {
          path: "support",
          element: <AdminSupport/>,
        },
      ]}
  ]);
 return <RouterProvider router={router} />;
}

export default App

import { PageNotfond } from "../Components";
import AuthGuard from "../Middleware/AuthGuard";
import AppointmentGuard from "../Middleware/AppointmentGuard";
import DoctorBlog from "../Components/DoctorBlog";
import DoctorConsultations from "../Components/DoctorConsultations";
import PaymentPage from "../Components/PaymentPage";
import OnlinePayment from "../Components/OnlinePayment";
import AppointmentTable from "../Pages/Users/AppointmentTable";

import {
  SearchDoctors,
  Home,
  Login,
  Signup,
  DocotrDashboard,
  DoctorRendezVous,
  DoctorHistorique,
  DocotrSettings,
  UserSettings,
  UserProfile,
  UserChangePassword,
  BookingAppointment,
  DoctorsLogin,
  DoctorsSignup,
  AuthAdmin,
  DashboardAdmin,

  DoctorsList,
  PatientsList,
  NoVerifiedDoctors,
  UserVerifeyEmail,
  DoctorsVerificationEmail,
  DoctorsConfirmation,
  Aboutus,
  ContactUs,
  DoctorPage,

} from "../Pages";
import AuthDoctorGuard from "../Middleware/AuthDoctorGuard";
import GuardAdmin from "../Middleware/GuardAdmin";
import VerificationEmailGuard from "../Middleware/VerificationEmailGuard";
import DoctorEmailVerification from "../Middleware/DoctorEmailVerification";
import DoctorsConfirmationGuard from "../Middleware/DoctorsConfirmationGuard";
import VideoRoom from "../Pages/VideoRoom";
import Payments from "../Pages/Admin/Payments";
import AdminAppointments from "../Pages/Admin/AdminAppointments";
import ForgotPassword from "../Pages/ForgotPassword";
import DoctorForgotPassword from "../Pages/AuthDoctors/ForgotPassword";
import Prescriptions from "../Pages/Users/Prescriptions";
import DoctorDashboard from "../Pages/Admin/DoctorDashboard";
import UserDashboard from "../Pages/Admin/UserDashboard";

const { createBrowserRouter } = require("react-router-dom");

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <PageNotfond />,
    element: <Home />,
  },
  {
    path: "/About",
    element: <Aboutus />,
  },
  {
    path: "/Contact",
    element: <ContactUs />,
  },
  {
    path: "/doctor/View_Profile/:id",
    element: <DoctorPage />,
  },
  {
    path: "/search-doctor",
    element: <SearchDoctors />,
  },
  {
    path: "/room/:roomId",
    element: (
      <VideoRoom />
    )
  },
  {
    path: "/user-login",
    element: <Login />,
  },
  {
    path: "/user-signup",
    element: <Signup />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/bookingappointment/:id",
    element: (
      <AppointmentGuard>
        <BookingAppointment />
      </AppointmentGuard>
    ),
  },

  // Users Router

  {
    path: "/user/verifeyemail",
    element: (
      <VerificationEmailGuard>
        <UserVerifeyEmail />
      </VerificationEmailGuard>
    ),
  },

  {
    path: "/user/profile",
    element: (
      <AuthGuard>
        <UserProfile />
      </AuthGuard>
    ),
  },

  {
    path: "/user/settings",
    element: (
      <AuthGuard>
        <UserSettings />
      </AuthGuard>
    ),
  },
  
  {
    path: "/user/changepassword",
    element: (
      <AuthGuard>
        <UserChangePassword />
      </AuthGuard>
    ),
  },

  {
    path: "/user/booked-appointments",
    element: (
      <AuthGuard>
        <AppointmentTable/>
      </AuthGuard>
    )
  },

  {
    path: "/user/prescriptions",
    element: (
      <AuthGuard>
        <Prescriptions/>
      </AuthGuard>
    )
  },


  //Doctors Router
  {
    path: "/doctor/login",
    element: <DoctorsLogin />,
  },
  {
    path: "/doctor/forgot-password",
    element: <DoctorForgotPassword />,
  },
  {
    path: "/doctor/signup",
    element: <DoctorsSignup />,
  },

  {
    path: "/doctor/dashboard",
    element: (
      <AuthDoctorGuard>
        <DocotrDashboard />
      </AuthDoctorGuard>
    ),
  },
  {
    path: "/docotr/rendezvous",
    element: (
      <AuthDoctorGuard>
        <DoctorRendezVous />
      </AuthDoctorGuard>
    ),
  },
  {
    path: "/doctor/historique",
    element: (
      <AuthDoctorGuard>
        <DoctorHistorique />
      </AuthDoctorGuard>
    ),
  },
  {
    path: "/doctor/settings",
    element: (
      <AuthDoctorGuard>
        <DocotrSettings />
      </AuthDoctorGuard>
    ),
  },
  {
    path: "/doctor/verifyemail",
    element: (
      <DoctorEmailVerification>
        <DoctorsVerificationEmail />
      </DoctorEmailVerification>
    ),
  },
  {
    path: "/doctor/confirmation",
    element: (
      <DoctorsConfirmationGuard>
        <DoctorsConfirmation />
      </DoctorsConfirmationGuard>
    ),
  },

  // ADMIN ROUTE

  {
    path: "/admin/login",
    element: <AuthAdmin />,
  },
  {
    path: "/admin/dashboard",
    element: (
      <GuardAdmin>
        <DashboardAdmin />
      </GuardAdmin>
    ),
  },
  {
    path: "/admin/doctors",
    element: (
      <GuardAdmin>
        <DoctorsList />
      </GuardAdmin>
    ),
  },
  {
    path: "/admin/doctors/noverified",
    element: (
      <GuardAdmin>
        <NoVerifiedDoctors />
      </GuardAdmin>
    ),
  },
  {
    path: "/admin/patients",
    element: (
      <GuardAdmin>
        <PatientsList />
      </GuardAdmin>
    ),
  },
  {
    path: "/admin/appointments",
    element: (
      <GuardAdmin>
        <AdminAppointments />
      </GuardAdmin>
    ),
  },
  {
    path: "/admin/payments",
    element: (
      <GuardAdmin>
        <Payments />
      </GuardAdmin>
    ),
  },
  {
    path: "/admin/doctor-dashboard",
    element: (
      <GuardAdmin>
        <DoctorDashboard />
      </GuardAdmin>
    ),
  },
  {
    path: "/admin/user-dashboard",
    element: (
      <GuardAdmin>
        <UserDashboard />
      </GuardAdmin>
    ),
  },


  {
  path: "/blogs",
  element: <DoctorBlog />,
},
 {
  path: "/doctorConsultations",
  element: <DoctorConsultations />,
},

{
  path: "/payment",
  element: <PaymentPage />,
},

{
  path: "/onlinepayment",
  element: <OnlinePayment/>,
},

]);

export default router;

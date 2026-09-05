import { Route, Routes } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
// Public Pages
import Home from "./components/routes/Home";
import About from "./components/routes/About";
import Contact from "./components/routes/Contact";
import Auth from "./components/routes/Auth";
import Faq from "./components/routes/Faq";
import Feedback from "./components/page3/Feedback";

// Protected Pages
import Profile from "./components/Profile";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import OfficerDashboard from "./components/Dashboard/OfficerDashboard";
import CitizenDashboard from "./components/Dashboard/UserDashboard";

// Route Guard
import ProtectedRoute from "./routes/ProtectedRoute";
import RaiseComplaint from "./components/complaints/RaiseComplaint";
import TrackComplaint from "./components/complaints/TrackComplaint";
import PublicRoute from "./routes/PublicRoute";
import Unauthorized from "./pages/UnAuthorized";
import NavbarWrapper from "./Layout/Navbar/NavbarWrapper";
import Working from "./pages/Working";
import ComplaintDetails from "./components/complaints/ComplaintDetails";
import OfficerComplaints from "./components/complaints/OfficerComplaints";
import AdminComplaints from "./components/complaints/AdminComplaints";
import ManageOfficers from "./pages/ManageOfficers";
import MinistryDepartments from "./pages/MinistryDepartments";
import OfficerComplaintView from "./components/complaints/OfficerComplaintView";
import AdminComplaintsView from "./components/complaints/AdminComplaintsView";
import VerifyEmail from "./components/VerifyEmail";
import EditProfile from "./components/EditProfile";
import ResetPassword from "./components/ResetPassword";
import ResetPasswordToken from "./components/ResetPasswordToken";
import ChangePassword from "./components/ChangePassword";
import AdminContact from "./components/AdminContacts";
import FeedbackPage from "./components/complaints/FeedbackPage";


const App = () => {

  
  return (
    <>
      <NavbarWrapper />
      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />
        <Route path="/faq" element={<Faq />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/working" element={<Working />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPasswordToken />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* 🔐 Common Protected Route */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["citizen", "officer", "admin"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute allowedRoles={["citizen", "officer", "admin"]}>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        {/* 👤 User Only */}
        <Route
          path="/citizen/dashboard"
          element={
            <ProtectedRoute allowedRoles={["citizen"]}>
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🧑‍✈️ Officer Only */}
        <Route
          path="/officer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["officer"]}>
              <OfficerDashboard />
            </ProtectedRoute>
          }
        />

        {/* 👑 Admin Only */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/contacts"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminContact />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ministries"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MinistryDepartments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/raise-complaint"
          element={
            <ProtectedRoute>
              <RaiseComplaint />
            </ProtectedRoute>
          }
        />
        <Route
          path="/track-complaint"
          element={
            <ProtectedRoute>
              <TrackComplaint />
            </ProtectedRoute>
          }
        />
        <Route
          path="/track-complaint/:id"
          element={
            <ProtectedRoute>
              <ComplaintDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback/:complaintId"
          element={
            <ProtectedRoute>
              <FeedbackPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/officer/complaints"
          element={
            <ProtectedRoute allowedRoles={["officer"]}>
              <OfficerComplaints />
            </ProtectedRoute>
          }
        />
        <Route
          path="/officer/complaints/:id"
          element={
            <ProtectedRoute allowedRoles={["officer"]}>
              <OfficerComplaintView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminComplaints />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaints/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminComplaintsView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-officers"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageOfficers />
            </ProtectedRoute>
          }
        />
      </Routes>
      {/* This line enables toast messages */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </>
  );
};

export default App;

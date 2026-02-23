import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import SearchProviders from "./pages/SearchProviders";
import ProviderProfile from "./pages/ProviderProfile";
import ProviderDashboard from "./pages/ProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateProviderProfile from "./pages/CreateProviderProfile";
import CustomerBookings from "./pages/CustomerBookings";

import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      {/* Always visible */}
      <Navbar />

      <Routes>

        {/* ===== PUBLIC ===== */}

        <Route path="/" element={<SearchProviders />} />
        <Route path="/provider/:id" element={<ProviderProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ===== CUSTOMER ===== */}

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute role="customer">
              <CustomerBookings />
            </ProtectedRoute>
          }
        />

        {/* ===== PROVIDER ===== */}

        <Route
          path="/provider-dashboard"
          element={
            <ProtectedRoute role="provider">
              <ProviderDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-provider-profile"
          element={
            <ProtectedRoute role="provider">
              <CreateProviderProfile />
            </ProtectedRoute>
          }
        />

        {/* ===== ADMIN ===== */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;

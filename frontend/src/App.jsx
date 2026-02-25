import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/navbar";
import Footer from "./components/Footer/footer";
import ScrollToTop from "./components/ScrollToTop";
import WelcomeOverlay from "./components/WelcomeOverlay";
import "./styles/ux-refinements.css";

import Home from "./pages/Home";
import Apartments from "./pages/Apartaments";
import PropertyDetails from "./pages/PropertyDetails";
import About from "./pages/About";
import Contacts from "./pages/Contacts";
import Help from "./pages/Help";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import ToolsLayout from "./pages/Tools/ToolsLayout";
import EstimatorTool from "./pages/Tools/EstimatorTool";
import DealFinderTool from "./pages/Tools/DealFinderTool";
import MarketDashboard from "./pages/Tools/MarketDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./pages/Admin/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import Listings from "./pages/Admin/Listings";
import Users from "./pages/Admin/Users";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <WelcomeOverlay />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apartments" element={<Apartments />} />
        <Route path="/apartments/:id" element={<PropertyDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/help" element={<Help />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/tools" element={<ToolsLayout />}>
          <Route index element={<Navigate to="estimator" replace />} />
          <Route path="estimator" element={<EstimatorTool />} />
          <Route path="deal-finder" element={<DealFinderTool />} />
          <Route path="market-dashboard" element={<MarketDashboard />} />
        </Route>
        <Route
          path="/admin"
          element={(
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="listings" element={<Listings />} />
          <Route path="users" element={<Users />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

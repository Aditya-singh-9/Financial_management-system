
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import StudentPayments from "./pages/StudentPayments";
import AdminAnalytics from "./pages/AdminAnalytics";
import Students from "./pages/Students";
import Unauthorized from "./pages/Unauthorized";
import Reports from "./pages/Reports";
import FraudDetection from "./pages/FraudDetection";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import SalaryDashboard from "./pages/SalaryDashboard";
import TeacherDetails from "./pages/TeacherDetails";
import AppLayout from "./components/layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Announcements from "./pages/Announcements";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Protected Routes inside AppLayout */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                {/* Common routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
                
                {/* Student routes */}
                <Route 
                  path="/payments" 
                  element={
                    <ProtectedRoute allowedRoles={["student"]}>
                      <StudentPayments />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute allowedRoles={["student"]}>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                
                {/* New student routes */}
                <Route 
                  path="/announcements" 
                  element={
                    <ProtectedRoute allowedRoles={["student"]}>
                      <Announcements />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin routes */}
                <Route 
                  path="/analytics" 
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminAnalytics />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/students" 
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <Students />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/teachers" 
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <TeacherDetails />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/reports" 
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <Reports />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/fraud-detection" 
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <FraudDetection />
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/salary" 
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <SalaryDashboard />
                    </ProtectedRoute>
                  } 
                />
              </Route>
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

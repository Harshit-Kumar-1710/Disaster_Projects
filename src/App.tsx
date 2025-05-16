import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import AddLocation from './pages/AddLocation';
import SosPage from './pages/SosPage';
import CheckSafety from './pages/CheckSafety';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-800"></div>
          <h2 className="text-2xl font-semibold text-blue-800 mt-4">Loading Safescape...</h2>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/add-location" element={
          <ProtectedRoute>
            <AddLocation />
          </ProtectedRoute>
        } />
        <Route path="/sos" element={
          <ProtectedRoute>
            <SosPage />
          </ProtectedRoute>
        } />
        <Route path="/check-safety" element={
          <ProtectedRoute>
            <CheckSafety />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
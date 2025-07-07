import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { useAuth } from './contexts/AuthContext';
import { useAccessibility } from './contexts/AccessibilityContext';

// Layout Components
import Layout from './components/Layout/Layout';
import LoadingScreen from './components/Common/LoadingScreen';

// Authentication Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Main Application Pages
import Dashboard from './pages/Dashboard/Dashboard';
import StoryRecording from './pages/Stories/StoryRecording';
import StoryLibrary from './pages/Stories/StoryLibrary';
import StoryDetail from './pages/Stories/StoryDetail';
import MessageRecording from './pages/Messages/MessageRecording';
import MessageLibrary from './pages/Messages/MessageLibrary';
import LegacyBooks from './pages/LegacyBooks/LegacyBooks';
import LegacyBookDetail from './pages/LegacyBooks/LegacyBookDetail';
import VideoCall from './pages/VideoCall/VideoCall';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import ResidentManagement from './pages/Admin/ResidentManagement';
import ContentManagement from './pages/Admin/ContentManagement';

// Settings Pages
import Profile from './pages/Settings/Profile';
import Accessibility from './pages/Settings/Accessibility';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const { user, loading } = useAuth();
  const { fontSize, theme } = useAccessibility();

  if (loading) {
    return <LoadingScreen />;
  }

  // Apply accessibility settings
  const appStyle = {
    fontSize: fontSize === 'large' ? '1.2rem' : fontSize === 'medium' ? '1rem' : '0.875rem',
    minHeight: '100vh',
    backgroundColor: theme === 'dark' ? '#121212' : '#f5f5f5',
  };

  return (
    <Box sx={appStyle}>
      {user ? (
        <Layout>
          <Container maxWidth="xl" sx={{ py: 3 }}>
            <Routes>
              {/* Main Application Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/stories" element={
                <ProtectedRoute>
                  <StoryLibrary />
                </ProtectedRoute>
              } />
              
              <Route path="/stories/record" element={
                <ProtectedRoute>
                  <StoryRecording />
                </ProtectedRoute>
              } />
              
              <Route path="/stories/:storyId" element={
                <ProtectedRoute>
                  <StoryDetail />
                </ProtectedRoute>
              } />
              
              <Route path="/messages" element={
                <ProtectedRoute>
                  <MessageLibrary />
                </ProtectedRoute>
              } />
              
              <Route path="/messages/record" element={
                <ProtectedRoute>
                  <MessageRecording />
                </ProtectedRoute>
              } />
              
              <Route path="/legacy-books" element={
                <ProtectedRoute>
                  <LegacyBooks />
                </ProtectedRoute>
              } />
              
              <Route path="/legacy-books/:bookId" element={
                <ProtectedRoute>
                  <LegacyBookDetail />
                </ProtectedRoute>
              } />
              
              <Route path="/video-call" element={
                <ProtectedRoute>
                  <VideoCall />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['staff', 'admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/residents" element={
                <ProtectedRoute allowedRoles={['staff', 'admin']}>
                  <ResidentManagement />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/content" element={
                <ProtectedRoute allowedRoles={['staff', 'admin']}>
                  <ContentManagement />
                </ProtectedRoute>
              } />
              
              {/* Settings Routes */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              <Route path="/accessibility" element={
                <ProtectedRoute>
                  <Accessibility />
                </ProtectedRoute>
              } />
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Container>
        </Layout>
      ) : (
        <Routes>
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Default redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Box>
  );
}

export default App; 
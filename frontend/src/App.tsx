import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import StoryRecording from './pages/Stories/StoryRecording';
import StoryLibrary from './pages/Stories/StoryLibrary';
import StoryDetail from './pages/Stories/StoryDetail';
import MessageRecording from './pages/Messages/MessageRecording';
import MessageLibrary from './pages/Messages/MessageLibrary';
import LegacyBooks from './pages/LegacyBooks/LegacyBooks';
import LegacyBookDetail from './pages/LegacyBooks/LegacyBookDetail';
import VideoCall from './pages/VideoCall/VideoCall';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ResidentManagement from './pages/Admin/ResidentManagement';
import ContentManagement from './pages/Admin/ContentManagement';
import Profile from './pages/Settings/Profile';
import Accessibility from './pages/Settings/Accessibility';
import PrivateRoute from './components/Auth/PrivateRoute';
import AdminRoute from './components/Auth/AdminRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Stories Routes */}
            <Route path="stories">
              <Route path="record" element={<StoryRecording />} />
              <Route path="library" element={<StoryLibrary />} />
              <Route path=":storyId" element={<StoryDetail />} />
            </Route>
            
            {/* Messages Routes */}
            <Route path="messages">
              <Route path="record" element={<MessageRecording />} />
              <Route path="library" element={<MessageLibrary />} />
            </Route>
            
            {/* Legacy Books Routes */}
            <Route path="legacy-books">
              <Route index element={<LegacyBooks />} />
              <Route path=":bookId" element={<LegacyBookDetail />} />
            </Route>
            
            {/* Video Call Route */}
            <Route path="video-call" element={<VideoCall />} />
            
            {/* Settings Routes */}
            <Route path="settings">
              <Route path="profile" element={<Profile />} />
              <Route path="accessibility" element={<Accessibility />} />
            </Route>
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><Layout /></AdminRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<ResidentManagement />} />
            <Route path="content" element={<ContentManagement />} />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AccessibilityProvider>
    </AuthProvider>
  );
};

export default App; 
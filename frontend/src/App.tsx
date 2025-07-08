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
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0f1419',
      paper: '#1a2332',
    },
    primary: {
      main: '#10b981', // emerald green
    },
    secondary: {
      main: '#f59e0b', // amber gold
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f97316',
    },
    info: {
      main: '#3b82f6',
    },
    success: {
      main: '#059669',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1a2332 0%, #1e293b 100%)',
          border: '1px solid #334155',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #0f1419 0%, #1a2332 100%)',
          borderBottom: '1px solid #334155',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1a2332 0%, #1e293b 100%)',
          border: '1px solid #334155',
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
          '&:hover': {
            border: '1px solid #10b981',
            boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.2)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            boxShadow: '0 6px 8px -1px rgba(16, 185, 129, 0.4)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease-in-out',
        },
        outlined: {
          borderColor: '#10b981',
          color: '#10b981',
          '&:hover': {
            background: 'rgba(16, 185, 129, 0.1)',
            borderColor: '#059669',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'rgba(30, 41, 59, 0.5)',
            borderColor: '#475569',
            '&:hover': {
              borderColor: '#10b981',
            },
            '&.Mui-focused': {
              borderColor: '#10b981',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: '#0f1419',
          fontWeight: 600,
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ minHeight: '100vh', background: '#0f1419' }}>
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
      </div>
    </ThemeProvider>
  );
};

export default App; 
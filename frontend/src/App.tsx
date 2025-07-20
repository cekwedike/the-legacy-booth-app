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
    mode: 'light',
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    primary: {
      main: '#059669', // emerald green
      light: '#10b981',
      dark: '#047857',
    },
    secondary: {
      main: '#16a34a', // forest green
      light: '#22c55e',
      dark: '#15803d',
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    info: {
      main: '#06b6d4',
    },
    success: {
      main: '#10b981',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
    divider: '#e5e7eb',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      color: '#1f2937',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      color: '#1f2937',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#1f2937',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#1f2937',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.125rem',
      color: '#1f2937',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      color: '#1f2937',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          color: '#1f2937',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 20,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          '&:hover': {
            border: '1px solid #10b981',
            boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.1), 0 4px 6px -2px rgba(16, 185, 129, 0.05)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.95rem',
          padding: '12px 24px',
          boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
            boxShadow: '0 6px 8px -1px rgba(16, 185, 129, 0.3)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        outlined: {
          background: 'transparent',
          border: '2px solid #059669',
          color: '#059669',
          '&:hover': {
            background: 'rgba(16, 185, 129, 0.05)',
            border: '2px solid #10b981',
            color: '#10b981',
          },
        },
        text: {
          background: 'transparent',
          color: '#059669',
          '&:hover': {
            background: 'rgba(16, 185, 129, 0.05)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            '&:hover': {
              border: '1px solid #10b981',
              background: '#ffffff',
            },
            '&.Mui-focused': {
              border: '2px solid #059669',
              background: '#ffffff',
              boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.1)',
            },
            '& input': {
              color: '#1f2937',
              '&::placeholder': {
                color: '#9ca3af',
                opacity: 1,
              },
            },
          },
          '& .MuiInputLabel-root': {
            color: '#6b7280',
            '&.Mui-focused': {
              color: '#059669',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
          color: '#ffffff',
          fontWeight: 600,
          borderRadius: 8,
          '&.MuiChip-colorSuccess': {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          },
          '&.MuiChip-colorWarning': {
            background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
          },
          '&.MuiChip-colorError': {
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          background: 'rgba(16, 185, 129, 0.05)',
          border: '1px solid rgba(16, 185, 129, 0.1)',
          borderRadius: 12,
          color: '#059669',
          '&:hover': {
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            transform: 'scale(1.05)',
          },
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '4px 0',
          '&:hover': {
            background: 'rgba(16, 185, 129, 0.05)',
          },
          '&.Mui-selected': {
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#e5e7eb',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          background: '#f3f4f6',
          borderRadius: 4,
        },
        bar: {
          background: 'linear-gradient(90deg, #059669 0%, #10b981 100%)',
          borderRadius: 4,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          cursor: 'pointer',
          textDecoration: 'none',
          color: '#059669',
          '&:hover': {
            textDecoration: 'none',
            color: '#047857',
          },
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ minHeight: '100vh', background: '#ffffff' }}>
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
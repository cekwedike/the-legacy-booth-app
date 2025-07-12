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
import ErrorBoundary from './components/Common/ErrorBoundary';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0a0a0f',
      paper: 'rgba(30, 30, 50, 0.8)',
    },
    primary: {
      main: '#6366f1', // electric indigo
    },
    secondary: {
      main: '#8b5cf6', // vibrant purple
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e0b',
    },
    info: {
      main: '#06b6d4',
    },
    success: {
      main: '#10b981',
    },
    text: {
      primary: '#ffffff',
      secondary: '#a1a1aa',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.125rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
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
          background: 'rgba(30, 30, 50, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(10, 10, 15, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(30, 30, 50, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 20,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          '&:hover': {
            border: '1px solid rgba(99, 102, 241, 0.5)',
            boxShadow: '0 12px 40px rgba(99, 102, 241, 0.2)',
            transform: 'translateY(-4px)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.95rem',
          padding: '12px 24px',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        outlined: {
          background: 'transparent',
          border: '2px solid #6366f1',
          color: '#6366f1',
          '&:hover': {
            background: 'rgba(99, 102, 241, 0.1)',
            border: '2px solid #8b5cf6',
            color: '#8b5cf6',
          },
        },
        text: {
          background: 'transparent',
          color: '#6366f1',
          '&:hover': {
            background: 'rgba(99, 102, 241, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'rgba(30, 30, 50, 0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 12,
            '&:hover': {
              border: '1px solid rgba(99, 102, 241, 0.5)',
            },
            '&.Mui-focused': {
              border: '2px solid #6366f1',
              boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.1)',
            },
            '& input': {
              color: '#ffffff',
              '&::placeholder': {
                color: '#a1a1aa',
                opacity: 1,
              },
            },
          },
          '& .MuiInputLabel-root': {
            color: '#a1a1aa',
            '&.Mui-focused': {
              color: '#6366f1',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: '#ffffff',
          fontWeight: 600,
          borderRadius: 8,
          '&.MuiChip-colorSuccess': {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          },
          '&.MuiChip-colorWarning': {
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
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
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: 12,
          '&:hover': {
            background: 'rgba(99, 102, 241, 0.2)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
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
            background: 'rgba(99, 102, 241, 0.1)',
          },
          '&.Mui-selected': {
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 4,
        },
        bar: {
          background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
          borderRadius: 4,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          cursor: 'pointer',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'none',
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
      <div style={{ minHeight: '100vh', background: '#0f1419' }}>
        <AuthProvider>
          <AccessibilityProvider>
            <ErrorBoundary>
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
            </ErrorBoundary>
          </AccessibilityProvider>
        </AuthProvider>
      </div>
    </ThemeProvider>
  );
};

export default App; 
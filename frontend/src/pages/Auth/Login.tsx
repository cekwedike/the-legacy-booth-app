import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  Divider,
  Fade
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  AutoAwesome,
  Star
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)
          `,
          animation: 'pulse 4s ease-in-out infinite alternate',
        },
        '@keyframes pulse': {
          '0%': { opacity: 0.5 },
          '100%': { opacity: 1 },
        },
      }}
    >
      {/* Floating Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
        }}
      >
        <AutoAwesome sx={{ fontSize: 40, color: 'rgba(99, 102, 241, 0.3)' }} />
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      >
        <Star sx={{ fontSize: 30, color: 'rgba(139, 92, 246, 0.3)' }} />
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '20%',
          animation: 'float 7s ease-in-out infinite',
        }}
      >
        <AutoAwesome sx={{ fontSize: 35, color: 'rgba(6, 182, 212, 0.3)' }} />
      </Box>

      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: 5,
              borderRadius: 4,
              background: 'rgba(30, 30, 50, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
                transform: 'translate(-50%, -50%)',
                animation: 'rotate 20s linear infinite',
                '@keyframes rotate': {
                  '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
                  '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
                },
              },
            }}
          >
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 5, position: 'relative', zIndex: 1 }}>
              <Box sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                mb: 3,
                boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.5)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -2,
                  left: -2,
                  right: -2,
                  bottom: -2,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
                  zIndex: -1,
                  animation: 'spin 3s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                },
              }}>
                <AutoAwesome sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h3" sx={{ 
                fontWeight: 700, 
                mb: 2,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              }}>
                Welcome Back
              </Typography>
              <Typography variant="h6" sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: 400,
                letterSpacing: '0.5px',
              }}>
                Sign in to continue preserving your legacy
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Fade in timeout={300}>
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 4, 
                    borderRadius: 2,
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                  }}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4, position: 'relative', zIndex: 1 }}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                sx={{ mb: 4 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          '&:hover': {
                            color: '#6366f1',
                            background: 'rgba(99, 102, 241, 0.1)',
                          },
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 2,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 30px -5px rgba(99, 102, 241, 0.5)',
                  },
                  '&:disabled': {
                    background: 'rgba(99, 102, 241, 0.3)',
                    transform: 'none',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)',
                  borderRadius: 3,
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  letterSpacing: '0.5px',
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box>

            {/* Divider */}
            <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', px: 2 }}>
                or
              </Typography>
            </Divider>

            {/* Register Link */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                Don't have an account?
              </Typography>
              <Link
                component={RouterLink}
                to="/register"
                sx={{
                  color: '#6366f1',
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    color: '#8b5cf6',
                    textDecoration: 'underline',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                Create an account
              </Link>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login; 
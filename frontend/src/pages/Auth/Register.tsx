import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  Divider,
  Fade,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Link
} from '@mui/material';
import {
  Email,
  Lock,
  Person,
  AutoAwesome,
  Star,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { RegisterData } from '../../types';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'resident',
    roomNumber: '',
    dateOfBirth: '',
    emergencyContact: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (e: any) => {
    setFormData({
      ...formData,
      role: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.role === 'resident') {
      if (!formData.roomNumber || !formData.dateOfBirth || !formData.emergencyContact) {
        setError('Room number, date of birth, and emergency contact are required for residents');
        return;
      }
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
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
                Create Account
              </Typography>
              <Typography variant="h6" sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: 400,
                letterSpacing: '0.5px',
              }}>
                Join us to start preserving your legacy
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

            {/* Registration Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4, position: 'relative', zIndex: 1 }}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                    </InputAdornment>
                  ),
                }}
              />
              
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

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleSelectChange}
                  label="Role"
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(99, 102, 241, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#6366f1',
                    },
                    '& .MuiSelect-icon': {
                      color: 'rgba(255, 255, 255, 0.6)',
                    },
                  }}
                >
                  <MenuItem value="resident">Resident</MenuItem>
                  <MenuItem value="family">Family Member</MenuItem>
                  <MenuItem value="caregiver">Caregiver</MenuItem>
                </Select>
              </FormControl>
              
              {formData.role === 'resident' && (
                <>
                  <TextField
                    fullWidth
                    label="Room Number"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    required
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    sx={{ mb: 3 }}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    label="Emergency Contact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    required
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </>
              )}
              
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
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

              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
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
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          '&:hover': {
                            color: '#6366f1',
                            background: 'rgba(99, 102, 241, 0.1)',
                          },
                        }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                {loading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  'Create Account'
                )}
              </Button>
            </Box>

            {/* Divider */}
            <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', px: 2 }}>
                or
              </Typography>
            </Divider>

            {/* Login Link */}
            <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                Already have an account?
              </Typography>
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  color: '#6366f1',
                  textDecoration: 'none',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-block',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    color: '#8b5cf6',
                    background: 'rgba(99, 102, 241, 0.1)',
                    textDecoration: 'none',
                  },
                }}
              >
                Sign in to your account
              </Link>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Register; 
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
  Link,
  useTheme,
  useMediaQuery,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 50%, #ecfdf5 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 1, sm: 2 },
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
            radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(5, 150, 105, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(22, 196, 94, 0.05) 0%, transparent 50%)
          `,
          animation: 'pulse 4s ease-in-out infinite alternate',
        },
        '@keyframes pulse': {
          '0%': { opacity: 0.3 },
          '100%': { opacity: 0.6 },
        },
      }}
    >
      {/* Floating Elements - Hide on mobile for better performance */}
      {!isMobile && (
        <>
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
            <AutoAwesome sx={{ fontSize: 40, color: 'rgba(16, 185, 129, 0.4)' }} />
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: '20%',
              right: '15%',
              animation: 'float 8s ease-in-out infinite reverse',
            }}
          >
            <Star sx={{ fontSize: 30, color: 'rgba(5, 150, 105, 0.4)' }} />
          </Box>
          <Box
            sx={{
              position: 'absolute',
              bottom: '15%',
              left: '20%',
              animation: 'float 7s ease-in-out infinite',
            }}
          >
            <AutoAwesome sx={{ fontSize: 35, color: 'rgba(22, 196, 94, 0.4)' }} />
          </Box>
          {/* More stars for magical effect */}
          <Box sx={{ position: 'absolute', top: '5%', left: '50%', animation: 'float 10s ease-in-out infinite', zIndex: 0 }}>
            <Star sx={{ fontSize: 22, color: 'rgba(16, 185, 129, 0.3)' }} />
          </Box>
          <Box sx={{ position: 'absolute', top: '30%', left: '80%', animation: 'float 12s ease-in-out infinite reverse', zIndex: 0 }}>
            <Star sx={{ fontSize: 18, color: 'rgba(5, 150, 105, 0.3)' }} />
          </Box>
          <Box sx={{ position: 'absolute', top: '60%', left: '70%', animation: 'float 9s ease-in-out infinite', zIndex: 0 }}>
            <Star sx={{ fontSize: 26, color: 'rgba(16, 185, 129, 0.3)' }} />
          </Box>
          <Box sx={{ position: 'absolute', top: '80%', left: '10%', animation: 'float 11s ease-in-out infinite reverse', zIndex: 0 }}>
            <Star sx={{ fontSize: 20, color: 'rgba(22, 196, 94, 0.3)' }} />
          </Box>
          <Box sx={{ position: 'absolute', top: '70%', left: '60%', animation: 'float 13s ease-in-out infinite', zIndex: 0 }}>
            <Star sx={{ fontSize: 16, color: 'rgba(5, 150, 105, 0.3)' }} />
          </Box>
          <Box sx={{ position: 'absolute', top: '40%', left: '30%', animation: 'float 14s ease-in-out infinite reverse', zIndex: 0 }}>
            <Star sx={{ fontSize: 24, color: 'rgba(16, 185, 129, 0.3)' }} />
          </Box>
        </>
      )}

      <Container maxWidth="sm" sx={{ px: { xs: 1, sm: 2 } }}>
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: { xs: 2, sm: 4 },
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #059669 0%, #10b981 50%, #16a34a 100%)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)',
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
            <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4, md: 5 }, position: 'relative', zIndex: 1 }}>
              <Box sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: { xs: 80, sm: 100 },
                height: { xs: 80, sm: 100 },
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                color: 'white',
                mb: { xs: 2, sm: 3 },
                boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.3)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-2px',
                  left: '-2px',
                  right: '-2px',
                  bottom: '-2px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #059669, #10b981, #16a34a)',
                  zIndex: -1,
                  animation: 'spin 3s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                },
              }}>
                <AutoAwesome sx={{ fontSize: { xs: 32, sm: 40 } }} />
              </Box>
              <Typography variant="h3" component="h1" sx={{ 
                fontWeight: 700, 
                color: '#1f2937',
                mb: { xs: 0.5, sm: 1 },
                fontSize: { xs: '1.75rem', sm: '2.125rem', md: '2.5rem' },
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Join Legacy Booth
              </Typography>
              <Typography variant="body1" sx={{ 
                color: '#6b7280', 
                fontSize: { xs: '1rem', sm: '1.1rem' }
              }}>
                Create your account to start preserving your legacy
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ 
                mb: { xs: 2, sm: 3 }, 
                borderRadius: { xs: 1, sm: 2 },
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}>
                {error}
              </Alert>
            )}

            {/* Registration Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ position: 'relative', zIndex: 1 }}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                sx={{ mb: { xs: 2, sm: 3 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: '#059669' }} />
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
                sx={{ mb: { xs: 2, sm: 3 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#059669' }} />
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
                sx={{ mb: { xs: 2, sm: 3 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#059669' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#059669' }}
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
                sx={{ mb: { xs: 2, sm: 3 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#059669' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        sx={{ color: '#059669' }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl fullWidth sx={{ mb: { xs: 2, sm: 3 } }}>
                <InputLabel sx={{ color: '#6b7280' }}>Role</InputLabel>
                <Select
                  value={formData.role}
                  label="Role"
                  onChange={handleSelectChange}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e5e7eb',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#10b981',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#059669',
                    },
                  }}
                >
                  <MenuItem value="resident">Resident</MenuItem>
                  <MenuItem value="family">Family Member</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
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
                    sx={{ mb: { xs: 2, sm: 3 } }}
                  />

                  <TextField
                    fullWidth
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    sx={{ mb: { xs: 2, sm: 3 } }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Emergency Contact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    required
                    sx={{ mb: { xs: 2, sm: 3 } }}
                  />
                </>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: { xs: 1.25, sm: 1.5 },
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 600,
                  mb: { xs: 2, sm: 3 },
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
                  },
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} sx={{ color: 'white' }} />
                    Creating Account...
                  </Box>
                ) : (
                  'Create Account'
                )}
              </Button>

              <Divider sx={{ 
                my: { xs: 2, sm: 3 }, 
                '&::before, &::after': { borderColor: '#e5e7eb' } 
              }}>
                <Typography variant="body2" sx={{ 
                  color: '#6b7280', 
                  px: 2,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}>
                  or
                </Typography>
              </Divider>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ 
                  color: '#6b7280', 
                  mb: 1,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}>
                  Already have an account?{' '}
                  <Link
                    component={RouterLink}
                    to="/login"
                    sx={{
                      color: '#059669',
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        color: '#047857',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Sign in here
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Register; 
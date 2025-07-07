import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();
  const { fontSize } = useAccessibility();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: '100%',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                mb: 1,
                fontSize: fontSize === 'large' ? '2.5rem' : '2rem',
              }}
            >
              The Legacy Booth
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: fontSize === 'large' ? '1.1rem' : '1rem',
              }}
            >
              Your Story Matters
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: fontSize === 'large' ? '1.1rem' : '1rem',
                },
                '& .MuiInputBase-input': {
                  fontSize: fontSize === 'large' ? '1.1rem' : '1rem',
                },
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
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: fontSize === 'large' ? '1.1rem' : '1rem',
                },
                '& .MuiInputBase-input': {
                  fontSize: fontSize === 'large' ? '1.1rem' : '1rem',
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontSize: fontSize === 'large' ? '1.2rem' : '1rem',
                fontWeight: 600,
                borderRadius: 2,
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Box>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              or
            </Typography>
          </Divider>

          {/* Demo Login Buttons */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, textAlign: 'center' }}
            >
              Try a demo account:
            </Typography>
            
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Person />}
              onClick={() => {
                setFormData({
                  email: 'resident@demo.com',
                  password: 'password123',
                });
              }}
              sx={{
                mb: 1,
                fontSize: fontSize === 'large' ? '1rem' : '0.875rem',
              }}
            >
              Resident Demo
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Person />}
              onClick={() => {
                setFormData({
                  email: 'staff@demo.com',
                  password: 'password123',
                });
              }}
              sx={{
                fontSize: fontSize === 'large' ? '1rem' : '0.875rem',
              }}
            >
              Staff Demo
            </Button>
          </Box>

          {/* Footer */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: fontSize === 'large' ? '1rem' : '0.875rem',
              }}
            >
              Need help? Contact your facility staff
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login; 
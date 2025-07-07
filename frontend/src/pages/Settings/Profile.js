import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Avatar,
  Divider
} from '@mui/material';
import {
  Person,
  Save
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, updateUser } = useAuth();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('emergencyContact.')) {
      const field = name.split('.')[1];
      setProfile(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profile)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setSuccess('Profile updated successfully!');
      
      // Update user context if needed
      if (updateUser) {
        updateUser(updatedProfile);
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Profile Settings
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            {/* Profile Picture */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <Avatar
                sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}
              >
                <Person sx={{ fontSize: 60 }} />
              </Avatar>
            </Box>

            {/* Personal Information */}
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
            />
            
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
            />
            
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={profile.phone || ''}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />
            
            <TextField
              fullWidth
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={profile.dateOfBirth || ''}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />

            <Divider sx={{ my: 3 }} />

            {/* Emergency Contact */}
            <Typography variant="h6" gutterBottom>
              Emergency Contact
            </Typography>
            
            <TextField
              fullWidth
              label="Contact Name"
              name="emergencyContact.name"
              value={profile.emergencyContact?.name || ''}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />
            
            <TextField
              fullWidth
              label="Contact Phone"
              name="emergencyContact.phone"
              value={profile.emergencyContact?.phone || ''}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />
            
            <TextField
              fullWidth
              label="Relationship"
              name="emergencyContact.relationship"
              value={profile.emergencyContact?.relationship || ''}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<Save />}
                disabled={saving}
              >
                {saving ? <CircularProgress size={20} /> : 'Save Changes'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile; 
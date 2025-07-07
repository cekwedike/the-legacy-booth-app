import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Edit,
  Delete,
  Visibility,
  Add,
  Person
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ResidentManagement = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, residentId: null });
  const [editDialog, setEditDialog] = useState({ open: false, resident: null });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch residents');
      }

      const data = await response.json();
      setResidents(data);
    } catch (err) {
      setError(err.message || 'Failed to load residents');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/users/${deleteDialog.residentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete resident');
      }

      setResidents(residents.filter(resident => resident._id !== deleteDialog.residentId));
      setDeleteDialog({ open: false, residentId: null });
    } catch (err) {
      setError(err.message || 'Failed to delete resident');
    }
  };

  const handleEdit = async () => {
    try {
      const response = await fetch(`/api/admin/users/${editDialog.resident._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editDialog.resident)
      });

      if (!response.ok) {
        throw new Error('Failed to update resident');
      }

      const updatedResident = await response.json();
      setResidents(residents.map(resident => 
        resident._id === updatedResident._id ? updatedResident : resident
      ));
      setEditDialog({ open: false, resident: null });
    } catch (err) {
      setError(err.message || 'Failed to update resident');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Resident Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => navigate('/admin/users/add')}
          >
            Add Resident
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {residents.map((resident) => (
                <TableRow key={resident._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Person sx={{ mr: 1 }} />
                      {resident.name}
                    </Box>
                  </TableCell>
                  <TableCell>{resident.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={resident.role}
                      size="small"
                      color={resident.role === 'admin' ? 'error' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={resident.status || 'active'}
                      size="small"
                      color={resident.status === 'active' ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>{formatDate(resident.createdAt)}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => navigate(`/admin/users/${resident._id}`)}
                      size="small"
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      onClick={() => setEditDialog({ open: true, resident: { ...resident } })}
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => setDeleteDialog({ open: true, residentId: resident._id })}
                      color="error"
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, resident: null })} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Resident</DialogTitle>
        <DialogContent>
          {editDialog.resident && (
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="Name"
                value={editDialog.resident.name || ''}
                onChange={(e) => setEditDialog({
                  ...editDialog,
                  resident: { ...editDialog.resident, name: e.target.value }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                value={editDialog.resident.email || ''}
                onChange={(e) => setEditDialog({
                  ...editDialog,
                  resident: { ...editDialog.resident, email: e.target.value }
                })}
                margin="normal"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, resident: null })}>
            Cancel
          </Button>
          <Button onClick={handleEdit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, residentId: null })}>
        <DialogTitle>Delete Resident</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this resident? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, residentId: null })}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ResidentManagement; 
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Book,
  Edit,
  Delete,
  Visibility,
  AccessTime,
  Person
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LegacyBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, bookId: null });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/legacy-books', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch legacy books');
      }

      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError(err.message || 'Failed to load legacy books');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/legacy-books/${deleteDialog.bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete legacy book');
      }

      setBooks(books.filter(book => book._id !== deleteDialog.bookId));
      setDeleteDialog({ open: false, bookId: null });
    } catch (err) {
      setError(err.message || 'Failed to delete legacy book');
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
            Legacy Books
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/legacy-books/create')}
          >
            Create Legacy Book
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {books.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No legacy books yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Create a legacy book to compile your stories and messages for future generations.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/legacy-books/create')}
              >
                Create Your First Legacy Book
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {books.map((book) => (
              <Grid item xs={12} md={6} lg={4} key={book._id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h2" sx={{ flex: 1 }}>
                        {book.title}
                      </Typography>
                      <Chip
                        label={book.status || 'draft'}
                        size="small"
                        color={book.status === 'published' ? 'success' : 'default'}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {book.description || 'No description provided'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <AccessTime fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(book.createdAt)}
                      </Typography>
                      {book.storiesCount && (
                        <>
                          <Typography variant="caption" color="text.secondary">
                            •
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {book.storiesCount} stories
                          </Typography>
                        </>
                      )}
                    </Box>
                  </CardContent>
                  
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => navigate(`/legacy-books/${book._id}`)}
                    >
                      View Book
                    </Button>
                    
                    <IconButton
                      onClick={() => navigate(`/legacy-books/${book._id}/edit`)}
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                    
                    <IconButton
                      onClick={() => setDeleteDialog({ open: true, bookId: book._id })}
                      color="error"
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, bookId: null })}>
        <DialogTitle>Delete Legacy Book</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this legacy book? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, bookId: null })}>
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

export default LegacyBooks; 
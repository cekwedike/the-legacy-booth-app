import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  Book,
  AccessTime,
  Person,
  PlayArrow,
  Message
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LegacyBookDetail = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchBook();
  }, [bookId]);

  const fetchBook = async () => {
    try {
      const response = await fetch(`/api/legacy-books/${bookId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Legacy book not found');
      }

      const data = await response.json();
      setBook(data);
    } catch (err) {
      setError(err.message || 'Failed to load legacy book');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/legacy-books')}
          >
            Back to Legacy Books
          </Button>
        </Box>
      </Container>
    );
  }

  if (!book) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Legacy book not found
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton
            onClick={() => navigate('/legacy-books')}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            Legacy Book Details
          </Typography>
        </Box>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h5" component="h2" sx={{ flex: 1 }}>
                {book.title}
              </Typography>
              <Chip
                label={book.status || 'draft'}
                color={book.status === 'published' ? 'success' : 'default'}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {book.user?.name || 'Unknown'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(book.createdAt)}
                </Typography>
              </Box>
            </Box>

            {book.description && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {book.description}
                </Typography>
              </>
            )}

            {book.stories && book.stories.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Stories ({book.stories.length})
                </Typography>
                <List>
                  {book.stories.map((story, index) => (
                    <ListItem key={story._id} sx={{ pl: 0 }}>
                      <ListItemIcon>
                        <PlayArrow />
                      </ListItemIcon>
                      <ListItemText
                        primary={story.title}
                        secondary={story.description}
                      />
                      <Button
                        size="small"
                        onClick={() => navigate(`/stories/${story._id}`)}
                      >
                        View
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {book.messages && book.messages.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Messages ({book.messages.length})
                </Typography>
                <List>
                  {book.messages.map((message, index) => (
                    <ListItem key={message._id} sx={{ pl: 0 }}>
                      <ListItemIcon>
                        <Message />
                      </ListItemIcon>
                      <ListItemText
                        primary={`To: ${message.recipientName}`}
                        secondary={message.description}
                      />
                      <Button
                        size="small"
                        onClick={() => navigate(`/messages/${message._id}`)}
                      >
                        View
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => navigate(`/legacy-books/${bookId}/edit`)}
              >
                Edit Book
              </Button>
              
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={() => {
                  // Handle delete
                }}
              >
                Delete Book
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default LegacyBookDetail; 
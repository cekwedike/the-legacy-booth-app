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
  PlayArrow,
  Pause,
  Delete,
  Edit,
  Person,
  AccessTime,
  Message
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const MessageLibrary = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [playingId, setPlayingId] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, messageId: null });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (messageId, audioUrl) => {
    if (playingId === messageId) {
      setPlayingId(null);
    } else {
      setPlayingId(messageId);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/messages/${deleteDialog.messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }

      setMessages(messages.filter(message => message._id !== deleteDialog.messageId));
      setDeleteDialog({ open: false, messageId: null });
    } catch (err) {
      setError(err.message || 'Failed to delete message');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getMessageTypeColor = (type) => {
    const colors = {
      personal: 'primary',
      birthday: 'success',
      anniversary: 'secondary',
      holiday: 'warning',
      advice: 'info',
      memory: 'default'
    };
    return colors[type] || 'default';
  };

  const getMessageTypeLabel = (type) => {
    const labels = {
      personal: 'Personal',
      birthday: 'Birthday',
      anniversary: 'Anniversary',
      holiday: 'Holiday',
      advice: 'Advice',
      memory: 'Memory'
    };
    return labels[type] || type;
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
            Your Messages
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/messages/record')}
          >
            Record New Message
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {messages.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No messages yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Record special messages for your loved ones to cherish forever.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/messages/record')}
              >
                Record Your First Message
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {messages.map((message) => (
              <Grid item xs={12} md={6} lg={4} key={message._id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h2" sx={{ flex: 1 }}>
                        {message.recipientName}
                      </Typography>
                      <Chip
                        label={getMessageTypeLabel(message.messageType)}
                        size="small"
                        color={getMessageTypeColor(message.messageType)}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {message.description || 'No description provided'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <AccessTime fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(message.createdAt)}
                      </Typography>
                      {message.duration && (
                        <>
                          <Typography variant="caption" color="text.secondary">
                            •
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {Math.floor(message.duration / 60)}:{(message.duration % 60).toString().padStart(2, '0')}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </CardContent>
                  
                  <CardActions>
                    <IconButton
                      onClick={() => handlePlay(message._id, message.audioUrl)}
                      color="primary"
                    >
                      {playingId === message._id ? <Pause /> : <PlayArrow />}
                    </IconButton>
                    
                    <Button
                      size="small"
                      onClick={() => navigate(`/messages/${message._id}`)}
                    >
                      View Details
                    </Button>
                    
                    <IconButton
                      onClick={() => navigate(`/messages/${message._id}/edit`)}
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                    
                    <IconButton
                      onClick={() => setDeleteDialog({ open: true, messageId: message._id })}
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

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, messageId: null })}>
        <DialogTitle>Delete Message</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this message? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, messageId: null })}>
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

export default MessageLibrary; 
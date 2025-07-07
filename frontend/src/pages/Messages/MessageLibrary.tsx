import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add,
  Search,
  PlayArrow,
  Pause,
  Edit,
  Delete
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Message } from '../../types';

const MessageLibrary: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/messages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = (messageId: string) => {
    if (currentlyPlaying === messageId) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(messageId);
    }
  };

  const filteredMessages = messages.filter(message =>
    message.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.messageType.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            Message Library
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/messages/record')}
          >
            Record New Message
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Search messages"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
        />

        {filteredMessages.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="body1" color="text.secondary" align="center">
                No messages found.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {filteredMessages.map((message) => (
              <Grid item xs={12} md={6} lg={4} key={message._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      To: {message.recipientName}
                    </Typography>
                    <Chip label={message.messageType} size="small" sx={{ mb: 2 }} />
                    {message.description && (
                      <Typography variant="body2" color="text.secondary">
                        {message.description}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    {message.recording?.audioUrl && (
                      <IconButton
                        onClick={() => handlePlayPause(message._id)}
                        color="primary"
                      >
                        {currentlyPlaying === message._id ? <Pause /> : <PlayArrow />}
                      </IconButton>
                    )}
                    <Button size="small">View Details</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default MessageLibrary; 
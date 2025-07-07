import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Visibility,
  Delete,
  Book,
  Message
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [stories, setStories] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewDialog, setViewDialog] = useState({ open: false, content: null, type: null });
  const { user } = useAuth();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const [storiesResponse, messagesResponse] = await Promise.all([
        fetch('/api/admin/stories', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/admin/messages', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      if (!storiesResponse.ok || !messagesResponse.ok) {
        throw new Error('Failed to fetch content');
      }

      const [storiesData, messagesData] = await Promise.all([
        storiesResponse.json(),
        messagesResponse.json()
      ]);

      setStories(storiesData);
      setMessages(messagesData);
    } catch (err) {
      setError(err.message || 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (contentId, type) => {
    try {
      const endpoint = type === 'story' ? `/api/admin/stories/${contentId}/approve` : `/api/admin/messages/${contentId}/approve`;
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) {
        throw new Error('Failed to approve content');
      }

      // Update local state
      if (type === 'story') {
        setStories(stories.map(story => 
          story._id === contentId ? { ...story, status: 'approved' } : story
        ));
      } else {
        setMessages(messages.map(message => 
          message._id === contentId ? { ...message, status: 'approved' } : message
        ));
      }
    } catch (err) {
      setError(err.message || 'Failed to approve content');
    }
  };

  const handleReject = async (contentId, type) => {
    try {
      const endpoint = type === 'story' ? `/api/admin/stories/${contentId}/reject` : `/api/admin/messages/${contentId}/reject`;
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) {
        throw new Error('Failed to reject content');
      }

      // Update local state
      if (type === 'story') {
        setStories(stories.map(story => 
          story._id === contentId ? { ...story, status: 'rejected' } : story
        ));
      } else {
        setMessages(messages.map(message => 
          message._id === contentId ? { ...message, status: 'rejected' } : message
        ));
      }
    } catch (err) {
      setError(err.message || 'Failed to reject content');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
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
        <Typography variant="h4" component="h1" gutterBottom>
          Content Management
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
          <Tab label={`Stories (${stories.length})`} />
          <Tab label={`Messages (${messages.length})`} />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            {stories.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No stories to moderate
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {stories.map((story) => (
                  <Card key={story._id}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" component="h2" sx={{ flex: 1 }}>
                          {story.title}
                        </Typography>
                        <Chip
                          label={story.status || 'pending'}
                          color={getStatusColor(story.status)}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {story.description || 'No description provided'}
                      </Typography>
                      
                      <Typography variant="caption" color="text.secondary">
                        By: {story.user?.name || 'Unknown'} • {formatDate(story.createdAt)}
                      </Typography>
                    </CardContent>
                    
                    <CardActions>
                      <IconButton
                        onClick={() => setViewDialog({ open: true, content: story, type: 'story' })}
                        size="small"
                      >
                        <Visibility />
                      </IconButton>
                      
                      {story.status === 'pending' && (
                        <>
                          <Button
                            size="small"
                            startIcon={<CheckCircle />}
                            color="success"
                            onClick={() => handleApprove(story._id, 'story')}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            startIcon={<Cancel />}
                            color="error"
                            onClick={() => handleReject(story._id, 'story')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </CardActions>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            {messages.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No messages to moderate
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {messages.map((message) => (
                  <Card key={message._id}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" component="h2" sx={{ flex: 1 }}>
                          To: {message.recipientName}
                        </Typography>
                        <Chip
                          label={message.status || 'pending'}
                          color={getStatusColor(message.status)}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {message.description || 'No description provided'}
                      </Typography>
                      
                      <Typography variant="caption" color="text.secondary">
                        By: {message.user?.name || 'Unknown'} • {formatDate(message.createdAt)}
                      </Typography>
                    </CardContent>
                    
                    <CardActions>
                      <IconButton
                        onClick={() => setViewDialog({ open: true, content: message, type: 'message' })}
                        size="small"
                      >
                        <Visibility />
                      </IconButton>
                      
                      {message.status === 'pending' && (
                        <>
                          <Button
                            size="small"
                            startIcon={<CheckCircle />}
                            color="success"
                            onClick={() => handleApprove(message._id, 'message')}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            startIcon={<Cancel />}
                            color="error"
                            onClick={() => handleReject(message._id, 'message')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </CardActions>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* View Dialog */}
      <Dialog 
        open={viewDialog.open} 
        onClose={() => setViewDialog({ open: false, content: null, type: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {viewDialog.type === 'story' ? 'Story Details' : 'Message Details'}
        </DialogTitle>
        <DialogContent>
          {viewDialog.content && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {viewDialog.type === 'story' ? viewDialog.content.title : `To: ${viewDialog.content.recipientName}`}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {viewDialog.content.description || 'No description provided'}
              </Typography>
              {viewDialog.content.transcription && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Transcription:</strong> {viewDialog.content.transcription}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog({ open: false, content: null, type: null })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ContentManagement; 
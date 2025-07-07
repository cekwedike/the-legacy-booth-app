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
  Book,
  AccessTime
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const StoryLibrary = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [playingId, setPlayingId] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, storyId: null });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/stories', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }

      const data = await response.json();
      setStories(data);
    } catch (err) {
      setError(err.message || 'Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (storyId, audioUrl) => {
    if (playingId === storyId) {
      setPlayingId(null);
    } else {
      setPlayingId(storyId);
      // In a real app, you'd handle audio playback here
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/stories/${deleteDialog.storyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete story');
      }

      setStories(stories.filter(story => story._id !== deleteDialog.storyId));
      setDeleteDialog({ open: false, storyId: null });
    } catch (err) {
      setError(err.message || 'Failed to delete story');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
            Your Stories
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/stories/record')}
          >
            Record New Story
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {stories.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No stories yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Start recording your life stories to preserve your memories for future generations.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/stories/record')}
              >
                Record Your First Story
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {stories.map((story) => (
              <Grid item xs={12} md={6} lg={4} key={story._id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h2" sx={{ flex: 1 }}>
                        {story.title}
                      </Typography>
                      <Chip
                        label={story.status || 'draft'}
                        size="small"
                        color={story.status === 'published' ? 'success' : 'default'}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {story.description || 'No description provided'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <AccessTime fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(story.createdAt)}
                      </Typography>
                      {story.duration && (
                        <>
                          <Typography variant="caption" color="text.secondary">
                            •
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDuration(story.duration)}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </CardContent>
                  
                  <CardActions>
                    <IconButton
                      onClick={() => handlePlay(story._id, story.audioUrl)}
                      color="primary"
                    >
                      {playingId === story._id ? <Pause /> : <PlayArrow />}
                    </IconButton>
                    
                    <Button
                      size="small"
                      onClick={() => navigate(`/stories/${story._id}`)}
                    >
                      View Details
                    </Button>
                    
                    <IconButton
                      onClick={() => navigate(`/stories/${story._id}/edit`)}
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                    
                    <IconButton
                      onClick={() => setDeleteDialog({ open: true, storyId: story._id })}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, storyId: null })}>
        <DialogTitle>Delete Story</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this story? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, storyId: null })}>
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

export default StoryLibrary; 
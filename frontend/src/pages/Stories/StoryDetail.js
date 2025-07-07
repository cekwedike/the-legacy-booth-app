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
  Divider
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  ArrowBack,
  Edit,
  Delete,
  AccessTime,
  Person
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const StoryDetail = () => {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchStory();
  }, [storyId]);

  const fetchStory = async () => {
    try {
      const response = await fetch(`/api/stories/${storyId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Story not found');
      }

      const data = await response.json();
      setStory(data);
    } catch (err) {
      setError(err.message || 'Failed to load story');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    // In a real app, you'd handle audio playback here
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
            onClick={() => navigate('/stories')}
          >
            Back to Stories
          </Button>
        </Box>
      </Container>
    );
  }

  if (!story) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Story not found
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
            onClick={() => navigate('/stories')}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            Story Details
          </Typography>
        </Box>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h5" component="h2" sx={{ flex: 1 }}>
                {story.title}
              </Typography>
              <Chip
                label={story.status || 'draft'}
                color={story.status === 'published' ? 'success' : 'default'}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {story.user?.name || 'Unknown'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(story.createdAt)}
                </Typography>
              </Box>

              {story.duration && (
                <Typography variant="body2" color="text.secondary">
                  Duration: {formatDuration(story.duration)}
                </Typography>
              )}
            </Box>

            {story.description && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {story.description}
                </Typography>
              </>
            )}

            {story.transcription && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Transcription
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {story.transcription}
                </Typography>
              </>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <IconButton
                onClick={handlePlay}
                color="primary"
                size="large"
                sx={{ 
                  width: 80, 
                  height: 80,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark'
                  }
                }}
              >
                {isPlaying ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
              </IconButton>
            </Box>

            {story.audioUrl && (
              <audio
                src={story.audioUrl}
                controls
                style={{ width: '100%', marginTop: 16 }}
              />
            )}

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => navigate(`/stories/${storyId}/edit`)}
              >
                Edit Story
              </Button>
              
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={() => {
                  // Handle delete
                }}
              >
                Delete Story
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default StoryDetail; 
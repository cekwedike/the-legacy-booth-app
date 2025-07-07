import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  ArrowBack,
  PlayArrow,
  Pause,
  Edit,
  Delete
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Story } from '../../types';

const StoryDetail: React.FC = () => {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const navigate = useNavigate();
  const { storyId } = useParams<{ storyId: string }>();

  useEffect(() => {
    if (storyId) {
      fetchStory(storyId);
    }
  }, [storyId]);

  const fetchStory = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/stories/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch story');
      }

      const data = await response.json();
      setStory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch story');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleDelete = async () => {
    if (!story || !window.confirm('Are you sure you want to delete this story?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/stories/${story._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete story');
      }

      navigate('/stories/library');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete story');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'transcribed':
        return 'info';
      case 'recorded':
        return 'warning';
      case 'draft':
        return 'default';
      default:
        return 'default';
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

  if (!story) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          Story not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/stories/library')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            {story.title}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h5" component="h2">
                {story.title}
              </Typography>
              <Chip
                label={story.status}
                color={getStatusColor(story.status) as any}
              />
            </Box>

            {story.description && (
              <Typography variant="body1" sx={{ mb: 3 }}>
                {story.description}
              </Typography>
            )}

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Category: {story.category}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Created: {new Date(story.createdAt).toLocaleDateString()}
              </Typography>
            </Box>

            {story.recording && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recording
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton
                    onClick={handlePlayPause}
                    color="primary"
                    size="large"
                  >
                    {isPlaying ? <Pause /> : <PlayArrow />}
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    Duration: {Math.round((story.recording.duration || 0) / 60)}:{(story.recording.duration || 0) % 60 < 10 ? '0' : ''}{(story.recording.duration || 0) % 60}
                  </Typography>
                </Box>
                {story.recording.audioUrl && (
                  <audio
                    src={story.recording.audioUrl}
                    onEnded={() => setIsPlaying(false)}
                    style={{ display: 'none' }}
                  />
                )}
              </Box>
            )}

            {story.transcription && story.transcription.text && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Transcription
                </Typography>
                <Typography variant="body2" sx={{ backgroundColor: 'grey.50', p: 2, borderRadius: 1 }}>
                  {story.transcription.text}
                </Typography>
              </Box>
            )}

            {story.content && story.content.summary && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Summary
                </Typography>
                <Typography variant="body2">
                  {story.content.summary}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => navigate(`/stories/${story._id}`, { state: { edit: true } })}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default StoryDetail; 
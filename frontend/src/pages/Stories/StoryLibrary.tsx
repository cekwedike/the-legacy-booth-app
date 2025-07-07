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
  FilterList,
  PlayArrow,
  Pause,
  Edit,
  Delete
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Story } from '../../types';

const StoryLibrary: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const navigate = useNavigate();

  const categories = [
    'All Categories',
    'Childhood Memories',
    'Family Stories',
    'Career & Work',
    'Life Lessons',
    'Historical Events',
    'Travel Adventures',
    'Love & Relationships',
    'Hobbies & Interests',
    'Challenges Overcome',
    'Wisdom & Advice'
  ];

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    filterStories();
  }, [stories, searchTerm, categoryFilter]);

  const fetchStories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/stories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }

      const data = await response.json();
      setStories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stories');
    } finally {
      setLoading(false);
    }
  };

  const filterStories = () => {
    let filtered = stories;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(story =>
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (story.description && story.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (categoryFilter && categoryFilter !== 'All Categories') {
      filtered = filtered.filter(story => story.category === categoryFilter);
    }

    setFilteredStories(filtered);
  };

  const handlePlayPause = (storyId: string) => {
    if (currentlyPlaying === storyId) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(storyId);
    }
  };

  const handleDelete = async (storyId: string) => {
    if (!window.confirm('Are you sure you want to delete this story?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/stories/${storyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete story');
      }

      setStories(stories.filter(story => story._id !== storyId));
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
            Story Library
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/stories/record')}
          >
            Record New Story
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search stories"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {filteredStories.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="body1" color="text.secondary" align="center">
                {searchTerm || categoryFilter ? 'No stories found matching your criteria.' : 'No stories yet. Start recording your first story!'}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {filteredStories.map((story) => (
              <Grid item xs={12} md={6} lg={4} key={story._id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h3" sx={{ flex: 1 }}>
                        {story.title}
                      </Typography>
                      <Chip
                        label={story.status}
                        color={getStatusColor(story.status) as any}
                        size="small"
                      />
                    </Box>
                    
                    {story.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {story.description}
                      </Typography>
                    )}
                    
                    <Typography variant="caption" color="text.secondary">
                      Category: {story.category}
                    </Typography>
                    
                    {story.recording && (
                      <Typography variant="caption" display="block" color="text.secondary">
                        Duration: {Math.round((story.recording.duration || 0) / 60)}:{(story.recording.duration || 0) % 60 < 10 ? '0' : ''}{(story.recording.duration || 0) % 60}
                      </Typography>
                    )}
                  </CardContent>
                  
                  <CardActions>
                    {story.recording?.audioUrl && (
                      <IconButton
                        onClick={() => handlePlayPause(story._id)}
                        color="primary"
                      >
                        {currentlyPlaying === story._id ? <Pause /> : <PlayArrow />}
                      </IconButton>
                    )}
                    
                    <Button
                      size="small"
                      onClick={() => navigate(`/stories/${story._id}`)}
                    >
                      View Details
                    </Button>
                    
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/stories/${story._id}`, { state: { edit: true } })}
                    >
                      <Edit />
                    </IconButton>
                    
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(story._id)}
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
    </Container>
  );
};

export default StoryLibrary; 
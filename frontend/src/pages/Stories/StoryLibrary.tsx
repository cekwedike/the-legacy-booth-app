import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Grid,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme
} from '@mui/material';
import {
  Search,
  Add,
  PlayArrow,
  Pause,
  Edit,
  Delete,
  Book,
  Timer,
  MoreVert,
  Mic
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppStore, Story } from '../../store';

const StoryLibrary: React.FC = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const navigate = useNavigate();

  const categories = [
    'All Categories',
    'Family & Childhood',
    'Career & Work',
    'Love & Relationships',
    'Travel Adventures',
    'Life Lessons',
    'Historical Events',
    'Personal Achievements',
    'Friendships',
    'Hobbies & Interests',
    'Life Milestones'
  ];

  // Zustand store
  const stories = useAppStore(s => s.stories);
  const removeStory = useAppStore(s => s.removeStory);

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (story.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || story.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedStories = [...filteredStories].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return 0; // TODO: implement date sorting if date is available in Zustand
      case 'title':
        return a.title.localeCompare(b.title);
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  const handlePlay = (storyId: string) => {
    setIsPlaying(isPlaying === storyId ? null : storyId);
  };

  const handleDelete = (story: Story) => {
    setSelectedStory(story);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedStory) {
      removeStory(selectedStory.id);
    }
    setDeleteDialogOpen(false);
    setSelectedStory(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'transcribed':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 2, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Your Stories
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
              {sortedStories.length} stories • {stories.filter(s => s.favorite).length} favorites
            </Typography>
          </Box>
          <Fab
            color="primary"
            aria-label="add story"
            onClick={() => navigate('/stories/record')}
            sx={{
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <Add />
          </Fab>
        </Box>

        {/* Search and Filters */}
        <Card sx={{ 
          mb: 4,
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
          border: '1.5px solid rgba(16,185,129,0.18)',
          boxShadow: '0 4px 24px 0 rgba(16,185,129,0.10)',
          color: '#fff',
          backdropFilter: 'blur(12px)',
        }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: theme.palette.text.primary }}>
                  Search Stories
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Search your stories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: theme.palette.text.primary }}>
                  Category
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category === 'All Categories' ? 'all' : category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: theme.palette.text.primary }}>
                  Sort By
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="date">Date</MenuItem>
                    <MenuItem value="title">Title</MenuItem>
                    <MenuItem value="duration">Duration</MenuItem>
                    <MenuItem value="category">Category</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Stories Grid */}
        <Grid container spacing={3}>
          {sortedStories.map((story) => (
            <Grid item xs={12} sm={6} lg={4} key={story.id}>
              <Card sx={{ 
                height: '100%',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 25px 50px -12px rgba(16,185,129,0.18)',
                },
                transition: 'all 0.3s ease-in-out',
                background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
                border: '1.5px solid rgba(16,185,129,0.18)',
                color: '#fff',
                backdropFilter: 'blur(10px)',
              }}>
                <CardContent sx={{ p: 3 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, lineHeight: 1.3 }}>
                        {story.title}
                      </Typography>
                      <Chip 
                        label={story.category} 
                        size="small" 
                        sx={{ 
                          background: 'rgba(16, 185, 129, 0.1)', 
                          color: '#10b981',
                          fontSize: '0.7rem',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                    <IconButton size="small">
                      <MoreVert />
                    </IconButton>
                  </Box>

                  {/* Description */}
                  <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.5, color: '#ffffff' }}>
                    {story.description}
                  </Typography>

                  {/* Stats */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Timer sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" sx={{ color: '#ffffff' }}>
                        {story.duration}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Timer sx={{ fontSize: 16, color: '#ffffff' }} />
                      <Typography variant="caption" sx={{ color: '#ffffff' }}>
                        {formatDate(story.date)}
                      </Typography>
                    </Box>
                    <Chip 
                      label={story.status} 
                      size="small"
                      color={getStatusColor(story.status) as any}
                      sx={{ fontSize: '0.6rem', height: 20 }}
                    />
                  </Box>

                  {/* Tags */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 3 }}>
                    {story.tags.slice(0, 3).map((tag: string, index: number) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          fontSize: '0.6rem', 
                          height: 20,
                          borderColor: 'rgba(16, 185, 129, 0.3)',
                          color: '#ffffff'
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                    <Button
                      variant="contained"
                      startIcon={isPlaying === story.id ? <Pause /> : <PlayArrow />}
                      onClick={() => handlePlay(story.id)}
                      sx={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        },
                        borderRadius: 2,
                        fontWeight: 600
                      }}
                    >
                      {isPlaying === story.id ? 'Pause' : 'Play'}
                    </Button>
                    <IconButton
                      onClick={() => navigate(`/stories/${story.id}`)}
                      sx={{
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#10b981',
                        '&:hover': {
                          background: 'rgba(16, 185, 129, 0.1)',
                        }
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(story)}
                      sx={{
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#ef4444',
                        '&:hover': {
                          background: 'rgba(239, 68, 68, 0.1)',
                        }
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Empty State */}
        {sortedStories.length === 0 && (
          <Card sx={{ 
            textAlign: 'center', 
            py: 8,
            background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
            border: '1.5px solid rgba(16,185,129,0.18)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
          }}>
            <CardContent>
              <Box sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                mb: 3
              }}>
                <Book sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                No stories found
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: '#ffffff' }}>
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Start recording your first story to preserve your memories'
                }
              </Typography>
              {!searchTerm && selectedCategory === 'all' && (
                <Button
                  variant="contained"
                  startIcon={<Mic />}
                  onClick={() => navigate('/stories/record')}
                  sx={{
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
                    }
                  }}
                >
                  Record Your First Story
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Story</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{selectedStory?.title}&quot;? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StoryLibrary; 
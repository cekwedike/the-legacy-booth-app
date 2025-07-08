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
  Avatar,
  LinearProgress,
  useTheme,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Search,
  Add,
  PlayArrow,
  Pause,
  Edit,
  Delete,
  FilterList,
  Sort,
  Book,
  Timer,
  Category,
  Person,
  CalendarToday,
  Star,
  Favorite,
  Share,
  MoreVert,
  Mic,
  AutoAwesome
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const StoryLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const navigate = useNavigate();
  const theme = useTheme();

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

  const stories = [
    {
      id: 1,
      title: 'My First Job at the Factory',
      category: 'Career & Work',
      duration: '5:32',
      date: '2024-01-15',
      status: 'published',
      description: 'The story of my first job and the valuable lessons I learned about hard work and perseverance.',
      tags: ['work', 'lessons', 'youth'],
      favorite: true,
      transcription: 'When I was 18 years old, I got my first job at the local factory...'
    },
    {
      id: 2,
      title: 'Family Vacation to Europe',
      category: 'Travel Adventures',
      duration: '8:15',
      date: '2024-01-10',
      status: 'transcribed',
      description: 'Our amazing family trip across Europe in the summer of 1975.',
      tags: ['travel', 'family', 'adventure'],
      favorite: false,
      transcription: 'It was the summer of 1975 when we decided to take the whole family to Europe...'
    },
    {
      id: 3,
      title: 'Meeting My Spouse',
      category: 'Love & Relationships',
      duration: '6:48',
      date: '2024-01-05',
      status: 'published',
      description: 'The magical moment when I first laid eyes on the love of my life.',
      tags: ['love', 'romance', 'meeting'],
      favorite: true,
      transcription: 'I remember the exact moment I saw her for the first time...'
    },
    {
      id: 4,
      title: 'Overcoming the Great Depression',
      category: 'Historical Events',
      duration: '12:24',
      date: '2023-12-20',
      status: 'published',
      description: 'How my family survived and thrived during the challenging years of the Great Depression.',
      tags: ['history', 'survival', 'family'],
      favorite: false,
      transcription: 'The Great Depression hit our family hard, but we learned to adapt...'
    },
    {
      id: 5,
      title: 'Learning to Play the Piano',
      category: 'Hobbies & Interests',
      duration: '4:56',
      date: '2023-12-15',
      status: 'transcribed',
      description: 'My journey of learning to play the piano and the joy it brought to my life.',
      tags: ['music', 'learning', 'passion'],
      favorite: true,
      transcription: 'I was 12 years old when my parents bought our first piano...'
    },
    {
      id: 6,
      title: 'The Day I Became a Parent',
      category: 'Life Milestones',
      duration: '7:12',
      date: '2023-12-10',
      status: 'published',
      description: 'The overwhelming joy and responsibility of becoming a parent for the first time.',
      tags: ['parenting', 'milestone', 'joy'],
      favorite: false,
      transcription: "I'll never forget the moment the nurse placed my first child in my arms..."
    }
  ];

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || story.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedStories = [...filteredStories].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'duration':
        return parseInt(a.duration.replace(':', '')) - parseInt(b.duration.replace(':', ''));
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  const handlePlay = (storyId: number) => {
    setIsPlaying(isPlaying === storyId ? null : storyId);
  };

  const handleDelete = (story: any) => {
    setSelectedStory(story);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // Handle delete logic here
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
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Your Stories
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {sortedStories.length} stories • {stories.filter(s => s.favorite).length} favorites
            </Typography>
          </Box>
          <Fab
            color="primary"
            aria-label="add story"
            onClick={() => navigate('/stories/record')}
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
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
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.3)'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search your stories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={selectedCategory}
                    label="Category"
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
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
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
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                },
                transition: 'all 0.3s ease-in-out',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)'
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
                          background: 'rgba(99, 102, 241, 0.1)', 
                          color: '#6366f1',
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
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.5 }}>
                    {story.description}
                  </Typography>

                  {/* Stats */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Timer sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {story.duration}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
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
                          borderColor: 'rgba(99, 102, 241, 0.3)',
                          color: 'text.secondary'
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
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        color: '#6366f1',
                        '&:hover': {
                          background: 'rgba(99, 102, 241, 0.1)',
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
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <CardContent>
              <Box sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.1)',
                color: '#6366f1',
                mb: 3
              }}>
                <Book sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                No stories found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
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
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
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
            Are you sure you want to delete "{selectedStory?.title}"? This action cannot be undone.
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
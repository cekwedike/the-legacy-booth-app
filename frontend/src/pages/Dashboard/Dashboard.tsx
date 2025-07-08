import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  IconButton,
  useTheme,
  Paper
} from '@mui/material';
import {
  Book,
  Message,
  VideoCall,
  Mic,
  PlayArrow,
  Star,
  Add,
  ArrowForward
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Record a Story',
      description: 'Share your life experiences and memories',
      icon: <Mic sx={{ fontSize: 32 }} />,
      path: '/stories/record',
      color: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      stats: '12 stories recorded'
    },
    {
      title: 'Create Message',
      description: 'Leave personal messages for loved ones',
      icon: <Message sx={{ fontSize: 32 }} />,
      path: '/messages/record',
      color: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
      stats: '8 messages created'
    },
    {
      title: 'Video Call',
      description: 'Connect with family and friends',
      icon: <VideoCall sx={{ fontSize: 32 }} />,
      path: '/video-call',
      color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      stats: '3 calls this week'
    },
    {
      title: 'Legacy Book',
      description: 'Compile your stories into a book',
      icon: <Book sx={{ fontSize: 32 }} />,
      path: '/legacy-books',
      color: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      stats: '2 books created'
    }
  ];

  const recentStories = [
    {
      id: 1,
      title: 'My First Job',
      category: 'Career & Work',
      duration: '5:32',
      date: '2 days ago',
      status: 'published'
    },
    {
      id: 2,
      title: 'Family Vacation to Europe',
      category: 'Travel Adventures',
      duration: '8:15',
      date: '1 week ago',
      status: 'transcribed'
    },
    {
      id: 3,
      title: 'Meeting My Spouse',
      category: 'Love & Relationships',
      duration: '6:48',
      date: '2 weeks ago',
      status: 'published'
    }
  ];

  const stats = [
    { label: 'Total Stories', value: '24', icon: <Book />, color: '#6366f1' },
    { label: 'Messages Sent', value: '18', icon: <Message />, color: '#f59e0b' },
    { label: 'Video Calls', value: '12', icon: <VideoCall />, color: '#10b981' },
    { label: 'Legacy Books', value: '3', icon: <Star />, color: '#3b82f6' }
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 2, mb: 4 }}>
        {/* Welcome Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 700, 
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}>
            Welcome back, {user?.name?.split(' ')[0] || 'Friend'}! 👋
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
            Ready to preserve more memories today?
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ 
                height: '100%',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: `${stat.color}20`,
                    color: stat.color,
                    mb: 2
                  }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Card sx={{ 
                height: '100%',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                },
                transition: 'all 0.3s ease-in-out'
              }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Box sx={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: action.color,
                    color: 'white',
                    mb: 3
                  }}>
                    {action.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {action.description}
                  </Typography>
                  <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                    {action.stats}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate(action.path)}
                    sx={{
                      background: action.color,
                      '&:hover': {
                        background: action.color,
                        transform: 'scale(1.02)',
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    Get Started
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Recent Activity */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Recent Stories
                  </Typography>
                  <Button
                    variant="text"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate('/stories/library')}
                    sx={{ fontWeight: 600 }}
                  >
                    View All
                  </Button>
                </Box>
                <Box>
                  {recentStories.map((story, _index) => (
                    <Box
                      key={story.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        mb: 2,
                        borderRadius: 2,
                        background: 'rgba(99, 102, 241, 0.05)',
                        border: '1px solid rgba(99, 102, 241, 0.1)',
                        cursor: 'pointer',
                        '&:hover': {
                          background: 'rgba(99, 102, 241, 0.1)',
                          transform: 'translateX(4px)',
                        },
                        transition: 'all 0.2s ease-in-out'
                      }}
                      onClick={() => navigate(`/stories/${story.id}`)}
                    >
                      <Avatar sx={{ 
                        mr: 2, 
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        width: 48,
                        height: 48
                      }}>
                        <PlayArrow />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {story.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Chip 
                            label={story.category} 
                            size="small" 
                            sx={{ 
                              background: 'rgba(99, 102, 241, 0.1)', 
                              color: '#6366f1',
                              fontSize: '0.7rem'
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {story.duration}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {story.date}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip 
                        label={story.status} 
                        size="small"
                        color={story.status === 'published' ? 'success' : 'warning'}
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Progress Overview
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Stories Goal
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      24/30
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={80} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      background: 'rgba(99, 102, 241, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        borderRadius: 4,
                      }
                    }}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Messages Goal
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      18/25
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={72} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      background: 'rgba(245, 158, 11, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                        borderRadius: 4,
                      }
                    }}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Legacy Books
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      3/5
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={60} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      background: 'rgba(59, 130, 246, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        borderRadius: 4,
                      }
                    }}
                  />
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => navigate('/stories/record')}
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    }
                  }}
                >
                  Record New Story
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard; 
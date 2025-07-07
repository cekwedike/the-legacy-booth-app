import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Book,
  Message,
  VideoCall,
  Person,
  TrendingUp,
  AccessTime,
  Star,
  Add,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fontSize } = useAccessibility();

  // Mock data - in real app, this would come from API
  const recentStories = [
    { id: 1, title: 'My First Job', category: 'career', date: '2024-01-15' },
    { id: 2, title: 'Family Vacation', category: 'family', date: '2024-01-10' },
  ];

  const recentMessages = [
    { id: 1, title: 'Birthday Wishes', recipient: 'Sarah', date: '2024-01-14' },
    { id: 2, title: 'Daily Thought', recipient: 'John', date: '2024-01-12' },
  ];

  const quickActions = [
    {
      title: 'Tell Your Story',
      description: 'Record a new life story',
      icon: <Book />,
      color: 'primary',
      path: '/stories/record',
    },
    {
      title: 'Leave a Message',
      description: 'Send a video message to family',
      icon: <Message />,
      color: 'secondary',
      path: '/messages/record',
    },
    {
      title: 'Video Call',
      description: 'Connect with loved ones',
      icon: <VideoCall />,
      color: 'success',
      path: '/video-call',
    },
    {
      title: 'View Legacy Books',
      description: 'See your story collection',
      icon: <Book />,
      color: 'info',
      path: '/legacy-books',
    },
  ];

  const getCategoryColor = (category) => {
    const colors = {
      childhood: 'primary',
      family: 'secondary',
      career: 'success',
      travel: 'info',
      hobbies: 'warning',
      'life-lessons': 'error',
      memories: 'default',
    };
    return colors[category] || 'default';
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 1,
            fontSize: fontSize === 'large' ? '2.5rem' : '2rem',
          }}
        >
          Welcome back, {user?.name}!
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            fontSize: fontSize === 'large' ? '1.3rem' : '1.1rem',
          }}
        >
          Ready to share your story today?
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}
              onClick={() => navigate(action.path)}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    mx: 'auto',
                    mb: 2,
                    bgcolor: `${action.color}.main`,
                  }}
                >
                  {action.icon}
                </Avatar>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                    fontSize: fontSize === 'large' ? '1.3rem' : '1.1rem',
                  }}
                >
                  {action.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    fontSize: fontSize === 'large' ? '1rem' : '0.875rem',
                  }}
                >
                  {action.description}
                </Typography>
                <Button
                  variant="contained"
                  color={action.color}
                  startIcon={<Add />}
                  size="small"
                >
                  Start
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        {/* Recent Stories */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Book sx={{ mr: 1, color: 'primary.main' }} />
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontWeight: 600,
                    fontSize: fontSize === 'large' ? '1.3rem' : '1.1rem',
                  }}
                >
                  Recent Stories
                </Typography>
              </Box>
              
              {recentStories.length > 0 ? (
                <List>
                  {recentStories.map((story, index) => (
                    <React.Fragment key={story.id}>
                      <ListItem>
                        <ListItemIcon>
                          <Book color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              sx={{
                                fontWeight: 500,
                                fontSize: fontSize === 'large' ? '1.1rem' : '1rem',
                              }}
                            >
                              {story.title}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <Chip
                                label={story.category}
                                size="small"
                                color={getCategoryColor(story.category)}
                                sx={{ mr: 1 }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {new Date(story.date).toLocaleDateString()}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < recentStories.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    No stories yet
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/stories/record')}
                  >
                    Record Your First Story
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Messages */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Message sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontWeight: 600,
                    fontSize: fontSize === 'large' ? '1.3rem' : '1.1rem',
                  }}
                >
                  Recent Messages
                </Typography>
              </Box>
              
              {recentMessages.length > 0 ? (
                <List>
                  {recentMessages.map((message, index) => (
                    <React.Fragment key={message.id}>
                      <ListItem>
                        <ListItemIcon>
                          <Message color="secondary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              sx={{
                                fontWeight: 500,
                                fontSize: fontSize === 'large' ? '1.1rem' : '1rem',
                              }}
                            >
                              {message.title}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <Person sx={{ mr: 0.5, fontSize: '1rem' }} />
                              <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                                To: {message.recipient}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(message.date).toLocaleDateString()}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < recentMessages.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    No messages yet
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<Add />}
                    onClick={() => navigate('/messages/record')}
                  >
                    Send Your First Message
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tips Section */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              mb: 2,
              fontWeight: 600,
              fontSize: fontSize === 'large' ? '1.3rem' : '1.1rem',
            }}
          >
            💡 Tips for Great Stories
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Star sx={{ color: 'warning.main', mr: 1 }} />
                <Typography
                  variant="body2"
                  sx={{ fontSize: fontSize === 'large' ? '1rem' : '0.875rem' }}
                >
                  Speak naturally and take your time
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccessTime sx={{ color: 'info.main', mr: 1 }} />
                <Typography
                  variant="body2"
                  sx={{ fontSize: fontSize === 'large' ? '1rem' : '0.875rem' }}
                >
                  Stories can be 2-10 minutes long
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUp sx={{ color: 'success.main', mr: 1 }} />
                <Typography
                  variant="body2"
                  sx={{ fontSize: fontSize === 'large' ? '1rem' : '0.875rem' }}
                >
                  Include details that make it personal
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard; 
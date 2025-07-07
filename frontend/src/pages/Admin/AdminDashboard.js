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
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  People,
  Book,
  Message,
  VideoCall,
  TrendingUp,
  Settings,
  Person
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStories: 0,
    totalMessages: 0,
    totalBooks: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admin stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load admin stats');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <People />,
      color: 'primary',
      path: '/admin/users'
    },
    {
      title: 'Total Stories',
      value: stats.totalStories,
      icon: <Book />,
      color: 'secondary',
      path: '/admin/stories'
    },
    {
      title: 'Total Messages',
      value: stats.totalMessages,
      icon: <Message />,
      color: 'success',
      path: '/admin/messages'
    },
    {
      title: 'Total Legacy Books',
      value: stats.totalBooks,
      icon: <Book />,
      color: 'info',
      path: '/admin/books'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: <TrendingUp />,
      color: 'warning',
      path: '/admin/users'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'View and manage resident accounts',
      icon: <People />,
      path: '/admin/users'
    },
    {
      title: 'Content Management',
      description: 'Review and moderate stories and messages',
      icon: <Book />,
      path: '/admin/content'
    },
    {
      title: 'System Settings',
      description: 'Configure application settings',
      icon: <Settings />,
      path: '/admin/settings'
    }
  ];

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
          Admin Dashboard
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ color: `${stat.color}.main`, mr: 2 }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h6" component="h2">
                      {stat.title}
                    </Typography>
                  </Box>
                  <Typography variant="h4" component="div" color={`${stat.color}.main`}>
                    {stat.value}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => navigate(stat.path)}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
          Quick Actions
        </Typography>
        
        <Grid container spacing={3}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ color: 'primary.main', mr: 2 }}>
                      {action.icon}
                    </Box>
                    <Typography variant="h6" component="h3">
                      {action.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {action.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    onClick={() => navigate(action.path)}
                    fullWidth
                  >
                    {action.title}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Recent Activity */}
        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
          Recent Activity
        </Typography>
        
        <Card>
          <CardContent>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText
                  primary="New user registration"
                  secondary="John Doe registered as a new resident"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Book />
                </ListItemIcon>
                <ListItemText
                  primary="New story recorded"
                  secondary="Jane Smith recorded 'My Childhood Memories'"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Message />
                </ListItemIcon>
                <ListItemText
                  primary="New message created"
                  secondary="Bob Johnson created a birthday message for his granddaughter"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AdminDashboard; 
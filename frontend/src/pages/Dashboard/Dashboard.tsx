import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button
} from '@mui/material';
import {
  Book,
  Message,
  VideoCall,
  Settings
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
      icon: <Book />,
      path: '/stories/record',
      color: 'primary'
    },
    {
      title: 'Record a Message',
      description: 'Create personal messages for loved ones',
      icon: <Message />,
      path: '/messages/record',
      color: 'secondary'
    },
    {
      title: 'Video Call',
      description: 'Connect with family and friends',
      icon: <VideoCall />,
      path: '/video-call',
      color: 'success'
    },
    {
      title: 'Settings',
      description: 'Customize your experience',
      icon: <Settings />,
      path: '/settings/profile',
      color: 'info'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.name}!
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Welcome to The Legacy Booth. Here you can preserve your memories, 
          connect with loved ones, and create lasting legacies for future generations.
        </Typography>

        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
          Quick Actions
        </Typography>
        
        <Grid container spacing={3}>
          {quickActions.map((action) => (
            <Grid item xs={12} sm={6} md={3} key={action.title}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ color: `${action.color}.main`, mr: 2 }}>
                      {action.icon}
                    </Box>
                    <Typography variant="h6" component="h3">
                      {action.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {action.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color={action.color as any}
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

        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 6 }}>
          Recent Activity
        </Typography>
        
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Your recent stories, messages, and activities will appear here.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Dashboard; 
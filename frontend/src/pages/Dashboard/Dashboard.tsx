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
  LinearProgress
} from '@mui/material';
import { ArrowForward, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getDashboardConfig } from '../../config/dashboardConfig';
import { getIcon } from '../../utils/iconUtils';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const config = getDashboardConfig(user.role);
  const firstName = user?.name?.split(' ')[0] || 'Friend';
  const welcomeMessage = config.welcomeMessage.replace('{name}', firstName);

  // Resident Dashboard
  if (user.role === 'resident') {
    return (
      <Container maxWidth="xl">
        <Box sx={{ mt: 2, mb: 4 }}>
          {/* Welcome Header */}
          <Box sx={{ 
            mb: 4, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.8) 0%, rgba(6, 95, 70, 0.6) 100%)',
            borderRadius: 4,
            p: 4,
            border: '2px solid rgba(16, 185, 129, 0.2)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.15)'
          }}>
            <Typography variant="h2" sx={{ 
              fontWeight: 800, 
              color: '#ffffff',
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
              letterSpacing: '-0.02em'
            }}>
              {welcomeMessage}
            </Typography>
            <Typography variant="h5" sx={{ 
              fontWeight: 400, 
              color: '#e5e7eb',
              opacity: 0.9,
              fontSize: { xs: '1.3rem', md: '1.5rem' },
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}>
              {config.subtitle}
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {config.stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ 
                  height: '100%',
                  background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
                  border: `2px solid ${stat.color}`,
                  boxShadow: `0 4px 24px 0 ${stat.color}33`,
                  color: stat.color,
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: `0 8px 32px 0 ${stat.color}66`,
                    borderColor: '#fff',
                  },
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Box sx={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: `${stat.color}22`,
                      color: stat.color,
                      mb: 2,
                      boxShadow: `0 2px 8px 0 ${stat.color}33`,
                    }}>
                      {getIcon(stat.iconName)}
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#fff' }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#ffffff' }}>
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Quick Actions */}
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            {config.sections.quickActions}
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {config.quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <Card sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  background: 'linear-gradient(145deg, #065f46 0%, #064e3b 100%)',
                  border: '1px solid rgba(16,185,129,0.2)',
                  color: '#fff',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: action.color,
                    zIndex: 1
                  },
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 20px 40px rgba(16,185,129,0.2)',
                    borderColor: 'rgba(16,185,129,0.4)',
                    '& .action-icon': {
                      transform: 'scale(1.1) rotate(5deg)',
                    }
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  <CardContent sx={{ p: 4, textAlign: 'center', position: 'relative' }}>
                    <Box sx={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      width: 70,
                      height: 70,
                      borderRadius: '20px',
                      background: action.color,
                      color: 'white',
                      mb: 3,
                      position: 'relative',
                      className: 'action-icon',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: '-2px',
                        left: '-2px',
                        right: '-2px',
                        bottom: '-2px',
                        background: action.color,
                        borderRadius: '22px',
                        opacity: 0.3,
                        zIndex: -1,
                        filter: 'blur(8px)'
                      }
                    }}>
                      {getIcon(action.iconName, { sx: { fontSize: 28 } })}
                    </Box>
                    
                    <Typography variant="h6" sx={{ 
                      fontWeight: 700, 
                      mb: 2, 
                      fontSize: '1.1rem',
                      background: 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      {action.title}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ 
                      mb: 3, 
                      color: '#d1d5db',
                      lineHeight: 1.6,
                      fontSize: '0.9rem'
                    }}>
                      {action.description}
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mb: 3
                    }}>
                      <Typography variant="caption" sx={{ 
                        fontWeight: 600, 
                        color: '#10b981',
                        fontSize: '0.8rem',
                        padding: '4px 12px',
                        background: 'rgba(16,185,129,0.1)',
                        borderRadius: '12px',
                        border: '1px solid rgba(16,185,129,0.2)'
                      }}>
                        {action.stats}
                      </Typography>
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ p: 4, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => navigate(action.path)}
                      sx={{
                        background: action.color,
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        py: 1.5,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        '&:hover': {
                          background: action.color,
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                        },
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      {action.buttonText || 'Get Started'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Recent Activity */}
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
                border: '1.5px solid rgba(16,185,129,0.18)',
                color: '#fff',
                backdropFilter: 'blur(10px)',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {config.sections.recentStories}
                    </Typography>
                    <Button
                      variant="text"
                      endIcon={<ArrowForward />}
                      onClick={() => navigate('/stories/library')}
                      sx={{ fontWeight: 600 }}
                    >
                      {config.sections.viewAllButton}
                    </Button>
                  </Box>
                  <Box>
                    {config.recentStories.map((story, _index) => (
                      <Box
                        key={story.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 2,
                          mb: 2,
                          borderRadius: 2,
                          background: 'rgba(16, 185, 129, 0.05)',
                          border: '1px solid rgba(16, 185, 129, 0.1)',
                          cursor: 'pointer',
                          '&:hover': {
                            background: 'rgba(16, 185, 129, 0.1)',
                            transform: 'translateX(4px)',
                          },
                          transition: 'all 0.2s ease-in-out'
                        }}
                        onClick={() => navigate(`/stories/${story.id}`)}
                      >
                        <Avatar sx={{ 
                          mr: 2, 
                          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                          width: 48,
                          height: 48
                        }}>
                          {getIcon('PlayArrow')}
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
                                background: 'rgba(16, 185, 129, 0.1)', 
                                color: '#10b981',
                                fontSize: '0.7rem'
                              }}
                            />
                            <Typography variant="caption" sx={{ color: '#ffffff' }}>
                              {story.duration}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#ffffff' }}>
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
              <Card sx={{ 
                background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
                border: '1.5px solid rgba(16,185,129,0.18)',
                color: '#fff',
                backdropFilter: 'blur(10px)',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    {config.sections.progressOverview}
                  </Typography>
                  
                  {config.progressGoals.map((goal, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {goal.label}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#ffffff' }}>
                          {goal.current}/{goal.target}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(goal.current / goal.target) * 100} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          background: `${goal.color}1a`,
                          '& .MuiLinearProgress-bar': {
                            background: `linear-gradient(135deg, ${goal.color} 0%, ${goal.color}dd 100%)`,
                            borderRadius: 4,
                          }
                        }}
                      />
                    </Box>
                  ))}

                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/stories/record')}
                    sx={{
                      background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
                      }
                    }}
                  >
                    {config.sections.recordNewButton} Story
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    );
  }

  // Family and Caregiver Dashboards
  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 2, mb: 4 }}>
        {/* Welcome Header */}
        <Box sx={{ 
          mb: 4, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.8) 0%, rgba(6, 95, 70, 0.6) 100%)',
          borderRadius: 4,
          p: 4,
          border: '2px solid rgba(16, 185, 129, 0.2)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(16, 185, 129, 0.15)'
        }}>
          <Typography variant="h2" sx={{ 
            fontWeight: 800, 
            color: '#ffffff',
            mb: 2,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            letterSpacing: '-0.02em'
          }}>
            {welcomeMessage}
          </Typography>
          <Typography variant="h5" sx={{ 
            fontWeight: 400, 
            color: '#e5e7eb',
            opacity: 0.9,
            fontSize: { xs: '1.1rem', md: '1.3rem' },
            maxWidth: '600px',
            mx: 'auto',
            lineHeight: 1.6
          }}>
            {config.subtitle}
          </Typography>
        </Box>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {config.quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ 
                height: '100%', 
                background: action.color, 
                color: 'white',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                }
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {getIcon(action.iconName, { sx: { fontSize: 40 } })}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {action.description}
                  </Typography>
                  <Button 
                    variant="contained" 
                    sx={{ 
                      mt: 2,
                      background: 'rgba(255,255,255,0.2)',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.3)',
                      }
                    }} 
                    onClick={() => navigate(action.path)}
                  >
                    {action.title.includes('View') ? 'View' : action.title.includes('Manage') ? 'Manage' : action.title.includes('Start') ? 'Start' : action.title.includes('Read') ? 'Read' : action.title.includes('Browse') ? 'Browse' : 'Open'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard; 
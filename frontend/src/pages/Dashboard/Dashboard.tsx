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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ArrowForward, Add, Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getDashboardConfig } from '../../config/dashboardConfig';
import { getIcon } from '../../utils/iconUtils';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  if (!user) return null;

  const config = getDashboardConfig(user.role);
  const firstName = user?.name?.split(' ')[0] || 'Friend';
  const welcomeMessage = config.welcomeMessage.replace('{name}', firstName);

  // Resident Dashboard
  if (user.role === 'resident') {
    return (
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        <Box sx={{ mt: { xs: 1, sm: 2 }, mb: { xs: 2, sm: 4 } }}>
          {/* Welcome Header */}
          <Box sx={{ 
            mb: { xs: 2, sm: 4 }, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
            borderRadius: { xs: 2, sm: 4 },
            p: { xs: 2, sm: 3, md: 4 },
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background Pattern */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(5, 150, 105, 0.05) 0%, transparent 50%)',
              zIndex: 0
            }} />
            
            {/* Legacy Booth Branding */}
            <Box sx={{ position: 'relative', zIndex: 1, mb: { xs: 2, sm: 3 } }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mb: { xs: 1, sm: 2 }
              }}>
                <Star sx={{ 
                  fontSize: { xs: 24, sm: 32, md: 40 }, 
                  mr: { xs: 1, sm: 2 }, 
                  color: '#059669',
                  filter: 'drop-shadow(0 4px 8px rgba(5, 150, 105, 0.2))'
                }} />
                <Typography variant="h3" sx={{ 
                  fontWeight: 900,
                  color: '#1f2937',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Legacy Booth
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 400, 
                color: '#6b7280',
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.2rem' },
                fontStyle: 'italic',
                letterSpacing: '0.05em'
              }}>
                Preserve Your Story
              </Typography>
            </Box>

            {/* Welcome Message */}
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h2" sx={{ 
                fontWeight: 800, 
                color: '#1f2937',
                mb: { xs: 1, sm: 2 },
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.8rem' },
                letterSpacing: '-0.02em'
              }}>
                {welcomeMessage}
              </Typography>
              <Typography variant="h5" sx={{ 
                fontWeight: 400, 
                color: '#6b7280',
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.3rem' },
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6
              }}>
                {config.subtitle}
              </Typography>
            </Box>
          </Box>

          {/* Stats Cards - Only show if enabled and has data */}
          {config.features.showStats && config.stats.length > 0 && (
            <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mb: { xs: 2, sm: 4 } }}>
              {config.stats.map((stat, index) => (
                <Grid item xs={6} sm={6} md={3} key={index}>
                  <Card sx={{ 
                    height: '100%',
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    borderRadius: { xs: 2, sm: 4 },
                    transition: 'all 0.3s',
                    '&:hover': {
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      borderColor: '#10b981',
                      transform: 'translateY(-2px)',
                    },
                  }}>
                    <CardContent sx={{ 
                      textAlign: 'center', 
                      p: { xs: 1.5, sm: 2, md: 3 } 
                    }}>
                      <Box sx={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        width: { xs: 40, sm: 50, md: 60 },
                        height: { xs: 40, sm: 50, md: 60 },
                        borderRadius: '50%',
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: '#059669',
                        mb: { xs: 1, sm: 2 },
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)',
                      }}>
                        {getIcon(stat.iconName)}
                      </Box>
                      <Typography variant="h4" sx={{ 
                        fontWeight: 700, 
                        mb: { xs: 0.5, sm: 1 }, 
                        color: '#1f2937',
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                      }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#6b7280',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}>
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Quick Actions - Only show if enabled and has data */}
          {config.features.showQuickActions && config.quickActions.length > 0 && (
            <>
              <Typography variant="h5" sx={{ 
                fontWeight: 600, 
                mb: { xs: 2, sm: 3 }, 
                color: '#1f2937',
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}>
                {config.sections.quickActions}
              </Typography>
              <Box sx={{ mb: { xs: 2, sm: 4 } }}>
                {config.quickActions.map((action, index) => (
                  <Card 
                    key={index}
                    sx={{ 
                      mb: { xs: 1, sm: 2 },
                      cursor: 'pointer',
                      background: '#ffffff',
                      border: '1px solid #e5e7eb',
                      color: '#1f2937',
                      borderRadius: { xs: 2, sm: 3 },
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateX(8px)',
                        boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.1), 0 4px 6px -2px rgba(16, 185, 129, 0.05)',
                        borderColor: '#10b981',
                      },
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => navigate(action.path)}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      p: { xs: 2, sm: 3 },
                      background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        width: { xs: 40, sm: 50 },
                        height: { xs: 40, sm: 50 },
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                        color: 'white',
                        mr: { xs: 2, sm: 3 },
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                        flexShrink: 0,
                      }}>
                        {getIcon(action.iconName)}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 600, 
                          color: '#1f2937', 
                          mb: { xs: 0.25, sm: 0.5 },
                          fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}>
                          {action.title}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: '#6b7280',
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}>
                          {action.description}
                        </Typography>
                      </Box>
                      <ArrowForward sx={{ 
                        color: '#059669', 
                        ml: { xs: 1, sm: 2 },
                        fontSize: { xs: '1.25rem', sm: '1.5rem' }
                      }} />
                    </Box>
                  </Card>
                ))}
              </Box>
            </>
          )}

          {/* Recent Activity - Only show if enabled and has data */}
          {config.features.showRecentActivity && config.recentActivity.length > 0 && (
            <>
              <Typography variant="h5" sx={{ 
                fontWeight: 600, 
                mb: { xs: 2, sm: 3 }, 
                color: '#1f2937',
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}>
                {config.sections.recentActivity}
              </Typography>
              <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mb: { xs: 2, sm: 4 } }}>
                {config.recentActivity.map((activity, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card sx={{ 
                      background: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: { xs: 2, sm: 3 },
                      '&:hover': {
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        borderColor: '#10b981',
                      },
                      transition: 'all 0.3s ease'
                    }}>
                      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ 
                            width: { xs: 32, sm: 40 }, 
                            height: { xs: 32, sm: 40 }, 
                            mr: { xs: 1.5, sm: 2 },
                            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                          }}>
                            {getIcon(activity.iconName)}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="subtitle1" sx={{ 
                              fontWeight: 600, 
                              color: '#1f2937',
                              fontSize: { xs: '0.875rem', sm: '1rem' }
                            }}>
                              {activity.title}
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              color: '#6b7280',
                              fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}>
                              {activity.timestamp}
                            </Typography>
                          </Box>
                          <Chip 
                            label={activity.status} 
                            size="small"
                            sx={{
                              background: activity.status === 'Completed' 
                                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                : 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                              color: 'white',
                              fontWeight: 600,
                              fontSize: { xs: '0.7rem', sm: '0.75rem' },
                              height: { xs: 20, sm: 24 },
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ 
                          color: '#6b7280', 
                          mb: 2,
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}>
                          {activity.description}
                        </Typography>
                        {activity.progress && (
                          <Box sx={{ width: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="caption" sx={{ 
                                color: '#6b7280',
                                fontSize: { xs: '0.7rem', sm: '0.75rem' }
                              }}>
                                Progress
                              </Typography>
                              <Typography variant="caption" sx={{ 
                                color: '#059669', 
                                fontWeight: 600,
                                fontSize: { xs: '0.7rem', sm: '0.75rem' }
                              }}>
                                {activity.progress}%
                              </Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={activity.progress}
                              sx={{
                                height: { xs: 4, sm: 6 },
                                borderRadius: { xs: 2, sm: 3 },
                                backgroundColor: '#f3f4f6',
                                '& .MuiLinearProgress-bar': {
                                  background: 'linear-gradient(90deg, #059669 0%, #10b981 100%)',
                                  borderRadius: { xs: 2, sm: 3 },
                                },
                              }}
                            />
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {/* Quick Start Guide - Only show if enabled */}
          {config.features.showQuickStart && (
            <>
              <Typography variant="h5" sx={{ 
                fontWeight: 600, 
                mb: { xs: 2, sm: 3 }, 
                color: '#1f2937',
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}>
                {config.sections.quickStart}
              </Typography>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                border: '1px solid #e5e7eb',
                borderRadius: { xs: 2, sm: 3 },
                mb: { xs: 2, sm: 4 },
              }}>
                <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600, 
                    color: '#1f2937', 
                    mb: { xs: 1, sm: 2 },
                    fontSize: { xs: '1.125rem', sm: '1.25rem' }
                  }}>
                    Getting Started
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: '#6b7280', 
                    mb: { xs: 2, sm: 3 }, 
                    lineHeight: 1.6,
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}>
                    {config.quickStart.description}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: { xs: 1, sm: 2 }, 
                    flexWrap: 'wrap',
                    flexDirection: { xs: 'column', sm: 'row' }
                  }}>
                    {config.quickStart.steps.map((step, index) => (
                      <Button
                        key={index}
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => navigate(step.path)}
                        sx={{
                          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          py: { xs: 1, sm: 1.5 },
                          px: { xs: 2, sm: 3 },
                          '&:hover': {
                            background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
                          },
                        }}
                      >
                        {step.title}
                      </Button>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </>
          )}
        </Box>
      </Container>
    );
  }

  // Family Member Dashboard
  if (user.role === 'family') {
    return (
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        <Box sx={{ mt: { xs: 1, sm: 2 }, mb: { xs: 2, sm: 4 } }}>
          {/* Welcome Header */}
          <Box sx={{ 
            mb: { xs: 2, sm: 4 }, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
            borderRadius: { xs: 2, sm: 4 },
            p: { xs: 2, sm: 3, md: 4 },
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}>
            <Typography variant="h2" sx={{ 
              fontWeight: 800, 
              color: '#1f2937',
              mb: { xs: 1, sm: 2 },
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {welcomeMessage}
            </Typography>
            <Typography variant="h5" sx={{ 
              fontWeight: 400, 
              color: '#6b7280',
              maxWidth: '600px',
              mx: 'auto',
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
            }}>
              {config.subtitle}
            </Typography>
          </Box>

          {/* Quick Actions */}
          <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
            {config.quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: { xs: 2, sm: 3 },
                  '&:hover': {
                    boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.1), 0 4px 6px -2px rgba(16, 185, 129, 0.05)',
                    borderColor: '#10b981',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease'
                }}
                  onClick={() => navigate(action.path)}
                >
                  <CardContent sx={{ 
                    p: { xs: 2, sm: 3 }, 
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <Box>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        width: { xs: 50, sm: 60 },
                        height: { xs: 50, sm: 60 },
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                        color: 'white',
                        mb: { xs: 1.5, sm: 2 },
                        mx: 'auto',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                      }}>
                        {getIcon(action.iconName)}
                      </Box>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        color: '#1f2937', 
                        mb: { xs: 0.5, sm: 1 },
                        fontSize: { xs: '1rem', sm: '1.25rem' }
                      }}>
                        {action.title}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#6b7280', 
                        mb: { xs: 1.5, sm: 2 },
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}>
                        {action.description}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      endIcon={<ArrowForward />}
                      sx={{
                        borderColor: '#059669',
                        color: '#059669',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        '&:hover': {
                          borderColor: '#10b981',
                          color: '#10b981',
                          background: 'rgba(16, 185, 129, 0.05)',
                        },
                      }}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    );
  }

  // Default Dashboard
  return (
    <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ mt: { xs: 1, sm: 2 }, mb: { xs: 2, sm: 4 } }}>
        <Typography variant="h2" sx={{ 
          fontWeight: 800, 
          color: '#1f2937',
          mb: { xs: 1, sm: 2 },
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {welcomeMessage}
        </Typography>
        <Typography variant="h5" sx={{ 
          color: '#6b7280', 
          mb: { xs: 2, sm: 4 },
          fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
        }}>
          {config.subtitle}
        </Typography>
        
        <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
          {config.quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ 
                height: '100%',
                cursor: 'pointer',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: { xs: 2, sm: 3 },
                '&:hover': {
                  boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.1), 0 4px 6px -2px rgba(16, 185, 129, 0.05)',
                  borderColor: '#10b981',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease'
              }}
                onClick={() => navigate(action.path)}
              >
                <CardContent sx={{ 
                  p: { xs: 2, sm: 3 }, 
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      width: { xs: 50, sm: 60 },
                      height: { xs: 50, sm: 60 },
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                      color: 'white',
                      mb: { xs: 1.5, sm: 2 },
                      mx: 'auto',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    }}>
                      {getIcon(action.iconName)}
                    </Box>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600, 
                      color: '#1f2937', 
                      mb: { xs: 0.5, sm: 1 },
                      fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}>
                      {action.title}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#6b7280', 
                      mb: { xs: 1.5, sm: 2 },
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}>
                      {action.description}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    endIcon={<ArrowForward />}
                    sx={{
                      borderColor: '#059669',
                      color: '#059669',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&:hover': {
                        borderColor: '#10b981',
                        color: '#10b981',
                        background: 'rgba(16, 185, 129, 0.05)',
                      },
                    }}
                  >
                    Get Started
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
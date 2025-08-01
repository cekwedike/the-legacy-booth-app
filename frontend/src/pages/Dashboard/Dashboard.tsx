import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getDashboardConfig, Stat, QuickAction } from '../../config/dashboardConfig';
import { getIcon } from '../../utils/iconUtils';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  if (!user) return null;

  const config = getDashboardConfig(user.role);
  const firstName = user?.name?.split(' ')[0] || 'Friend';
  const welcomeMessage = config.welcomeMessage.replace('{name}', firstName);

  // Faculty Dashboard
  if (user.role === 'faculty') {
    return (
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        <Box sx={{ mt: { xs: 1, sm: 2 }, mb: { xs: 2, sm: 4 } }}>
          {/* Welcome Header */}
          <Box sx={{ 
            mb: { xs: 2, sm: 4 }, 
            textAlign: 'center',
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
            borderRadius: { xs: 2, sm: 4 },
            p: { xs: 2, sm: 3, md: 4 },
            border: theme.palette.mode === 'dark' 
              ? '1px solid #334155'
              : '1px solid #e5e7eb',
            boxShadow: theme.palette.mode === 'dark'
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
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
                <Typography variant="h3" sx={{ 
                  fontWeight: 900,
                  color: theme.palette.text.primary,
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
                color: theme.palette.text.secondary,
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.2rem' },
                fontStyle: 'italic',
                letterSpacing: '0.05em'
              }}>
                Guide Seniors to Preserve Their Stories
              </Typography>
            </Box>

            {/* Welcome Message */}
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h2" sx={{ 
                fontWeight: 800, 
                color: theme.palette.text.primary,
                mb: { xs: 1, sm: 2 },
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.8rem' },
                letterSpacing: '-0.02em'
              }}>
                {welcomeMessage}
              </Typography>
              <Typography variant="h5" sx={{ 
                fontWeight: 400, 
                color: theme.palette.text.secondary,
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
              {config.stats.map((stat: Stat, index: number) => (
                <Grid item xs={6} sm={6} md={3} key={index}>
                  <Card sx={{ 
                    height: '100%',
                    background: theme.palette.background.paper,
                    border: theme.palette.mode === 'dark' 
                      ? '1px solid #334155'
                      : '1px solid #e5e7eb',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
                      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    borderRadius: { xs: 2, sm: 4 },
                    transition: 'all 0.3s',
                    '&:hover': {
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)'
                        : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
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
                        color: theme.palette.text.primary,
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                      }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: theme.palette.text.secondary,
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
                color: theme.palette.text.primary,
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}>
                {config.sections.quickActions}
              </Typography>
              <Box sx={{ mb: { xs: 2, sm: 4 } }}>
                {config.quickActions.map((action: QuickAction, index: number) => (
                  <Card 
                    key={index}
                    sx={{ 
                      mb: { xs: 1, sm: 2 },
                      cursor: 'pointer',
                      background: theme.palette.background.paper,
                      border: theme.palette.mode === 'dark' 
                        ? '1px solid #334155'
                        : '1px solid #e5e7eb',
                      color: theme.palette.text.primary,
                      borderRadius: { xs: 2, sm: 3 },
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateX(8px)',
                        boxShadow: theme.palette.mode === 'dark'
                          ? '0 10px 15px -3px rgba(16, 185, 129, 0.2), 0 4px 6px -2px rgba(16, 185, 129, 0.1)'
                          : '0 10px 15px -3px rgba(16, 185, 129, 0.1), 0 4px 6px -2px rgba(16, 185, 129, 0.05)',
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
                      background: theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                        : 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
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
                          color: theme.palette.text.primary, 
                          mb: { xs: 0.25, sm: 0.5 },
                          fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}>
                          {action.title}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: theme.palette.text.secondary,
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


        </Box>
      </Container>
    );
  }

  // Default Dashboard (for admin and other roles)
  return (
    <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ mt: { xs: 1, sm: 2 }, mb: { xs: 2, sm: 4 } }}>
        <Typography variant="h2" sx={{ 
          fontWeight: 800, 
          color: theme.palette.text.primary,
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
          color: theme.palette.text.secondary, 
          mb: { xs: 2, sm: 4 },
          fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
        }}>
          {config.subtitle}
        </Typography>
        
        <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
          {config.quickActions.map((action: QuickAction, index: number) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ 
                height: '100%',
                cursor: 'pointer',
                background: theme.palette.background.paper,
                border: theme.palette.mode === 'dark' 
                  ? '1px solid #334155'
                  : '1px solid #e5e7eb',
                borderRadius: { xs: 2, sm: 3 },
                '&:hover': {
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 10px 15px -3px rgba(16, 185, 129, 0.2), 0 4px 6px -2px rgba(16, 185, 129, 0.1)'
                    : '0 10px 15px -3px rgba(16, 185, 129, 0.1), 0 4px 6px -2px rgba(16, 185, 129, 0.05)',
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
                      color: theme.palette.text.primary, 
                      mb: { xs: 0.5, sm: 1 },
                      fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}>
                      {action.title}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: theme.palette.text.secondary, 
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
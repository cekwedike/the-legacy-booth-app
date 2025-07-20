import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Grid,
  Chip,
  Button,
  useTheme,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  Badge
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Download,
  Share,
  Book,
  Message,
  LibraryBooks,
  AccessTime,
  Palette,
  PlayArrow,
  Favorite,
  FavoriteBorder
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore, LegacyBook } from '../../store';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`book-tabpanel-${index}`}
      aria-labelledby={`book-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const LegacyBookDetail: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [tabValue, setTabValue] = useState(0);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Zustand store
  const legacyBooks = useAppStore(s => s.legacyBooks);
  const stories = useAppStore(s => s.stories);
  const messages = useAppStore(s => s.messages);

  const book = legacyBooks.find(b => b._id === id);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const toggleFavorite = (itemId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
    } else {
      newFavorites.add(itemId);
    }
    setFavorites(newFavorites);
  };

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'classic':
        return 'primary';
      case 'modern':
        return 'secondary';
      case 'vintage':
        return 'warning';
      case 'elegant':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!book) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error">
            Legacy Book not found
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/legacy-books')}
            sx={{ mt: 2 }}
          >
            Back to Legacy Books
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 2, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton 
            onClick={() => navigate('/legacy-books')} 
            sx={{ 
              mr: 2,
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981',
              '&:hover': {
                background: 'rgba(16, 185, 129, 0.1)',
              }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {book.title}
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
              Created on {formatDate(book.createdAt)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={() => navigate(`/legacy-books/${book._id}/edit`)}
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
              sx={{
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#10b981',
                '&:hover': {
                  background: 'rgba(16, 185, 129, 0.1)',
                }
              }}
            >
              <Download />
            </IconButton>
            <IconButton
              sx={{
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#10b981',
                '&:hover': {
                  background: 'rgba(16, 185, 129, 0.1)',
                }
              }}
            >
              <Share />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Book Info */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ 
              height: 'fit-content',
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                : 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
              border: theme.palette.mode === 'dark'
                ? '1.5px solid rgba(16,185,129,0.3)'
                : '1.5px solid rgba(16,185,129,0.18)',
              color: theme.palette.text.primary,
              backdropFilter: 'blur(10px)',
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Book Information
                </Typography>

                {book.description && (
                  <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.6, color: theme.palette.text.secondary }}>
                    {book.description}
                  </Typography>
                )}

                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                  <Chip 
                    label={book.theme} 
                    size="small" 
                    color={getThemeColor(book.theme) as any}
                    icon={<Palette />}
                    sx={{ fontWeight: 600 }}
                  />
                  <Chip 
                    label={book.status} 
                    size="small" 
                    color={getStatusColor(book.status) as any}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LibraryBooks sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      {book.storiesCount} Stories
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Message sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      {book.messagesCount} Messages
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Last updated {formatDate(book.updatedAt)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Content Tabs */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ 
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                : 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
              border: theme.palette.mode === 'dark'
                ? '1.5px solid rgba(16,185,129,0.3)'
                : '1.5px solid rgba(16,185,129,0.18)',
              color: theme.palette.text.primary,
              backdropFilter: 'blur(10px)',
            }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange}
                    sx={{
                      '& .MuiTab-root': {
                        color: theme.palette.text.secondary,
                        '&.Mui-selected': {
                          color: '#10b981',
                        },
                      },
                      '& .MuiTabs-indicator': {
                        backgroundColor: '#10b981',
                      },
                    }}
                  >
                    <Tab label={`Stories (${book.storiesCount})`} />
                    <Tab label={`Messages (${book.messagesCount})`} />
                  </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                  <Box sx={{ p: 3 }}>
                    {stories.length > 0 ? (
                      <List>
                        {stories.slice(0, 5).map((story, index) => (
                          <React.Fragment key={story.id}>
                            <ListItem sx={{ px: 0 }}>
                              <ListItemIcon>
                                <Book sx={{ color: '#10b981' }} />
                              </ListItemIcon>
                              <ListItemText
                                primary={story.title}
                                secondary={story.description}
                                primaryTypographyProps={{ fontWeight: 600 }}
                                secondaryTypographyProps={{ color: theme.palette.text.secondary }}
                              />
                              <IconButton
                                onClick={() => toggleFavorite(story.id)}
                                size="small"
                              >
                                {favorites.has(story.id) ? 
                                  <Favorite sx={{ color: '#ef4444', fontSize: 18 }} /> : 
                                  <FavoriteBorder sx={{ color: theme.palette.text.secondary, fontSize: 18 }} />
                                }
                              </IconButton>
                            </ListItem>
                            {index < stories.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body1" sx={{ textAlign: 'center', color: theme.palette.text.secondary }}>
                        No stories in this book yet.
                      </Typography>
                    )}
                  </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  <Box sx={{ p: 3 }}>
                    {messages.length > 0 ? (
                      <List>
                        {messages.slice(0, 5).map((message, index) => (
                          <React.Fragment key={message._id}>
                            <ListItem sx={{ px: 0 }}>
                              <ListItemIcon>
                                <Message sx={{ color: '#10b981' }} />
                              </ListItemIcon>
                              <ListItemText
                                primary={`To: ${message.recipientName}`}
                                secondary={message.description}
                                primaryTypographyProps={{ fontWeight: 600 }}
                                secondaryTypographyProps={{ color: theme.palette.text.secondary }}
                              />
                              <IconButton
                                onClick={() => toggleFavorite(message._id)}
                                size="small"
                              >
                                {favorites.has(message._id) ? 
                                  <Favorite sx={{ color: '#ef4444', fontSize: 18 }} /> : 
                                  <FavoriteBorder sx={{ color: theme.palette.text.secondary, fontSize: 18 }} />
                                }
                              </IconButton>
                            </ListItem>
                            {index < messages.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body1" sx={{ textAlign: 'center', color: theme.palette.text.secondary }}>
                        No messages in this book yet.
                      </Typography>
                    )}
                  </Box>
                </TabPanel>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default LegacyBookDetail; 
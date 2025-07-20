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
  TextField,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add,
  PlayArrow,
  Pause,
  Search,
  Message as MessageIcon,
  Timer,
  Person,
  Favorite,
  FavoriteBorder,
  Edit,
  Delete,
  MoreVert,
  Book
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppStore, Message } from '../../store';

const MessageLibrary: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  // Zustand store
  const messages = useAppStore(s => s.messages);

  const messageTypes = [
    'All Types',
    'personal',
    'birthday',
    'anniversary',
    'holiday',
    'advice',
    'memory'
  ];

  useEffect(() => {
    // Messages are loaded from store
  }, []);

  const handlePlayPause = (messageId: string) => {
    if (currentlyPlaying === messageId) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(messageId);
    }
  };

  const toggleFavorite = (messageId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(messageId)) {
      newFavorites.delete(messageId);
    } else {
      newFavorites.add(messageId);
    }
    setFavorites(newFavorites);
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'birthday':
        return 'success';
      case 'anniversary':
        return 'warning';
      case 'holiday':
        return 'info';
      case 'advice':
        return 'secondary';
      case 'memory':
        return 'primary';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.messageType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (message.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || message.messageType === selectedType;
    return matchesSearch && matchesType;
  });

  const sortedMessages = [...filteredMessages].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'recipient':
        return a.recipientName.localeCompare(b.recipientName);
      case 'type':
        return a.messageType.localeCompare(b.messageType);
      default:
        return 0;
    }
  });

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
              Your Messages
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
              {sortedMessages.length} messages • {favorites.size} favorites
            </Typography>
          </Box>
          <Fab
            color="primary"
            aria-label="record message"
            onClick={() => navigate('/messages/record')}
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

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Search and Filters */}
        <Card sx={{ 
          mb: 4,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
            : 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
          border: theme.palette.mode === 'dark'
            ? '1.5px solid rgba(16,185,129,0.3)'
            : '1.5px solid rgba(16,185,129,0.18)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 4px 24px 0 rgba(16,185,129,0.2)'
            : '0 4px 24px 0 rgba(16,185,129,0.10)',
          color: theme.palette.text.primary,
          backdropFilter: 'blur(12px)',
        }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: theme.palette.text.primary }}>
                  Search Messages
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Search by recipient, type, or description..."
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
                  Message Type
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    {messageTypes.map((type) => (
                      <MenuItem key={type} value={type === 'All Types' ? 'all' : type}>
                        {type}
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
                    <MenuItem value="recipient">Recipient</MenuItem>
                    <MenuItem value="type">Type</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Messages Grid */}
        <Grid container spacing={3}>
          {sortedMessages.map((message) => (
            <Grid item xs={12} sm={6} lg={4} key={message._id}>
              <Card sx={{ 
                height: '100%',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 25px 50px -12px rgba(16,185,129,0.3)'
                    : '0 25px 50px -12px rgba(16,185,129,0.18)',
                },
                transition: 'all 0.3s ease-in-out',
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                  : 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                border: theme.palette.mode === 'dark'
                  ? '1.5px solid rgba(16,185,129,0.3)'
                  : '1.5px solid rgba(16,185,129,0.18)',
                color: theme.palette.text.primary,
                backdropFilter: 'blur(10px)',
              }}>
                <CardContent sx={{ p: 3 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, lineHeight: 1.3 }}>
                        To: {message.recipientName}
                      </Typography>
                      <Chip 
                        label={message.messageType} 
                        size="small" 
                        color={getMessageTypeColor(message.messageType) as any}
                        sx={{ 
                          fontSize: '0.7rem',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                    <IconButton 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(message._id);
                      }}
                    >
                      {favorites.has(message._id) ? 
                        <Favorite sx={{ color: '#ef4444', fontSize: 20 }} /> : 
                        <FavoriteBorder sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
                      }
                    </IconButton>
                  </Box>

                  {/* Description */}
                  {message.description && (
                    <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.5, color: theme.palette.text.secondary }}>
                      {message.description}
                    </Typography>
                  )}

                  {/* Stats */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Person sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        {message.messageType}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Timer sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        {formatDate(message.createdAt)}
                      </Typography>
                    </Box>
                    {message.recording?.duration && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <MessageIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                          {Math.round(message.recording.duration / 60)}m
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                    {message.recording?.audioUrl && (
                      <Button
                        variant="contained"
                        startIcon={currentlyPlaying === message._id ? <Pause /> : <PlayArrow />}
                        onClick={() => handlePlayPause(message._id)}
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
                        {currentlyPlaying === message._id ? 'Pause' : 'Play'}
                      </Button>
                    )}
                    <IconButton
                      onClick={() => navigate(`/messages/${message._id}`)}
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
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Empty State */}
        {sortedMessages.length === 0 && (
          <Card sx={{ 
            textAlign: 'center', 
            py: 8,
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
              : 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
            border: theme.palette.mode === 'dark'
              ? '1.5px solid rgba(16,185,129,0.3)'
              : '1.5px solid rgba(16,185,129,0.18)',
            color: theme.palette.text.primary,
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
                <MessageIcon sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                No messages found
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: theme.palette.text.secondary }}>
                {searchTerm || selectedType !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Start recording your first message to share with loved ones'
                }
              </Typography>
              {!searchTerm && selectedType === 'all' && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => navigate('/messages/record')}
                  sx={{
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
                    },
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 600
                  }}
                >
                  Record Your First Message
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default MessageLibrary; 
import React, { useState, useEffect, useRef } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tooltip,
  Badge,
  ToggleButton,
  ToggleButtonGroup,
  Fade,
  Paper,
  Avatar,
  Stack,
  LinearProgress
} from '@mui/material';
import {
  Add,
  PlayArrow,
  Pause,
  Delete,
  Edit,
  Schedule,
  Star,
  StarBorder,
  Favorite,
  FavoriteBorder,
  Search,
  FilterList,
  Sort,
  MoreVert,
  CalendarToday,
  Timer,
  VolumeUp,
  VolumeOff,
  Speed,
  Download,
  Share,
  Archive,
  Unarchive,
  Visibility,
  VisibilityOff,
  Refresh,
  Mic,
  Videocam,
  Message,
  Person,
  Email,
  Phone
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  _id: string;
  title: string;
  recipientName: string;
  recipientEmail?: string;
  recipientRelationship?: string;
  messageType: string;
  description?: string;
  isScheduled: boolean;
  scheduledFor?: string;
  isPrivate: boolean;
  tags: string[];
  status: string;
  duration: number;
  createdAt: string;
  deliveredAt?: string;
  viewedAt?: string;
  analytics?: {
    playCount: number;
    lastPlayed?: string;
    favoriteCount: number;
    shareCount: number;
  };
}

const MessageLibrary: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const navigate = useNavigate();

  const messageTypes = [
    { value: 'all', label: 'All Types', icon: '📝' },
    { value: 'birthday', label: 'Birthday', icon: '🎂' },
    { value: 'anniversary', label: 'Anniversary', icon: '💕' },
    { value: 'holiday', label: 'Holiday', icon: '🎄' },
    { value: 'daily', label: 'Daily', icon: '☀️' },
    { value: 'encouragement', label: 'Encouragement', icon: '💪' },
    { value: 'memory', label: 'Memory', icon: '📸' },
    { value: 'advice', label: 'Advice', icon: '💡' },
    { value: 'gratitude', label: 'Gratitude', icon: '🙏' },
    { value: 'love', label: 'Love', icon: '❤️' },
    { value: 'wisdom', label: 'Wisdom', icon: '🧠' },
    { value: 'personal', label: 'Personal', icon: '💬' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'sent', label: 'Sent' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'viewed', label: 'Viewed' },
    { value: 'archived', label: 'Archived' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'title', label: 'Title' },
    { value: 'recipientName', label: 'Recipient' },
    { value: 'messageType', label: 'Type' },
    { value: 'duration', label: 'Duration' },
    { value: 'scheduledFor', label: 'Scheduled Date' }
  ];

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    // Handle audio playback speed
    if (audioRef) {
      audioRef.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, audioRef]);

  // Handle audio volume
  useEffect(() => {
    if (audioRef) {
      audioRef.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted, audioRef]);

  const fetchMessages = async () => {
    try {
      setRefreshing(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/messages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePlayPause = async (message: Message) => {
    if (currentlyPlaying === message._id) {
      // Stop playing
      if (audioRef) {
        audioRef.pause();
        audioRef.currentTime = 0;
      }
      setCurrentlyPlaying(null);
      setAudioRef(null);
    } else {
      // Start playing
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/messages/${message._id}/audio`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to load audio');
        }

        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          setCurrentlyPlaying(null);
          setAudioRef(null);
        };

        audio.onerror = () => {
          setError('Failed to play audio');
          setCurrentlyPlaying(null);
          setAudioRef(null);
        };

        audio.play();
        setCurrentlyPlaying(message._id);
        setAudioRef(audio);

        // Increment play count
        incrementPlayCount(message._id);
      } catch (error) {
        setError('Failed to play audio');
      }
    }
  };

  const incrementPlayCount = async (messageId: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/messages/${messageId}/play`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Failed to increment play count:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }

      setMessages(messages.filter(msg => msg._id !== messageId));
      setDeleteDialogOpen(false);
      setSelectedMessage(null);
    } catch (error) {
      setError('Failed to delete message');
    }
  };

  const handleArchiveMessage = async (messageId: string, archive: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: archive ? 'archived' : 'active'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update message');
      }

      setMessages(messages.map(msg => 
        msg._id === messageId 
          ? { ...msg, status: archive ? 'archived' : 'active' }
          : msg
      ));
    } catch (error) {
      setError('Failed to update message');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageTypeIcon = (type: string) => {
    const messageType = messageTypes.find(t => t.value === type);
    return messageType?.icon || '💬';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'scheduled': return 'warning';
      case 'sent': return 'info';
      case 'delivered': return 'primary';
      case 'viewed': return 'success';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  const filteredAndSortedMessages = messages
    .filter(message => {
      const matchesSearch = 
        message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = filterType === 'all' || message.messageType === filterType;
      const matchesStatus = filterStatus === 'all' || message.status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy as keyof Message];
      let bValue: any = b[sortBy as keyof Message];
      
      if (sortBy === 'createdAt' || sortBy === 'scheduledFor') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
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
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ color: '#fff', mb: 1 }}>
              Message Library
            </Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
              {filteredAndSortedMessages.length} message{filteredAndSortedMessages.length !== 1 ? 's' : ''} found
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/messages/record')}
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              }
            }}
          >
            Record New Message
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Controls */}
        <Card sx={{
          background: 'rgba(30, 30, 50, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#fff',
          mb: 3
        }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              {/* Search */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: '#a1a1aa' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '& input': { color: '#fff' },
                      '& input::placeholder': { color: '#a1a1aa' },
                    }
                  }}
                />
              </Grid>

              {/* Filter Type */}
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#a1a1aa' }}>Type</InputLabel>
                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '& .MuiSelect-icon': { color: '#a1a1aa' },
                    }}
                  >
                    {messageTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>{type.icon}</span>
                          {type.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Filter Status */}
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#a1a1aa' }}>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '& .MuiSelect-icon': { color: '#a1a1aa' },
                    }}
                  >
                    {statusOptions.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Sort */}
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#a1a1aa' }}>Sort</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '& .MuiSelect-icon': { color: '#a1a1aa' },
                    }}
                  >
                    {sortOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* View Mode & Refresh */}
              <Grid item xs={12} md={2}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(e, newMode) => {
                      if (newMode !== null) setViewMode(newMode);
                    }}
                    size="small"
                    sx={{
                      '& .MuiToggleButton-root': {
                        color: '#a1a1aa',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        '&.Mui-selected': {
                          background: 'rgba(99, 102, 241, 0.2)',
                          color: '#6366f1',
                        }
                      }
                    }}
                  >
                    <ToggleButton value="grid">Grid</ToggleButton>
                    <ToggleButton value="list">List</ToggleButton>
                  </ToggleButtonGroup>
                  
                  <IconButton
                    onClick={fetchMessages}
                    disabled={refreshing}
                    sx={{ color: '#a1a1aa' }}
                  >
                    <Refresh />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Messages Grid/List */}
        {filteredAndSortedMessages.length === 0 ? (
          <Card sx={{
            background: 'rgba(30, 30, 50, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff'
          }}>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" sx={{ color: '#a1a1aa', mb: 2 }}>
                No messages found
              </Typography>
              <Typography variant="body2" sx={{ color: '#71717a', mb: 3 }}>
                {searchTerm || filterType !== 'all' || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Start by recording your first message'
                }
              </Typography>
              {!searchTerm && filterType === 'all' && filterStatus === 'all' && (
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => navigate('/messages/record')}
                  sx={{
                    borderColor: '#6366f1',
                    color: '#6366f1',
                    '&:hover': {
                      borderColor: '#8b5cf6',
                      color: '#8b5cf6',
                    }
                  }}
                >
                  Record Your First Message
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {filteredAndSortedMessages.map((message) => (
              <Grid item xs={12} md={viewMode === 'grid' ? 6 : 12} lg={viewMode === 'grid' ? 4 : 12} key={message._id}>
                <Card sx={{
                  background: 'rgba(30, 30, 50, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    transform: 'translateY(-2px)',
                  }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {message.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#a1a1aa', mb: 1 }}>
                          To: {message.recipientName}
                          {message.recipientRelationship && ` (${message.recipientRelationship})`}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          icon={<span>{getMessageTypeIcon(message.messageType)}</span>}
                          label={message.messageType}
                          size="small"
                          sx={{
                            background: 'rgba(99, 102, 241, 0.2)',
                            color: '#6366f1'
                          }}
                        />
                        <Chip
                          label={message.status}
                          size="small"
                          color={getStatusColor(message.status) as any}
                        />
                      </Box>
                    </Box>

                    {message.description && (
                      <Typography variant="body2" sx={{ color: '#a1a1aa', mb: 2 }}>
                        {message.description}
                      </Typography>
                    )}

                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      {message.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            color: '#a1a1aa'
                          }}
                        />
                      ))}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" sx={{ color: '#71717a' }}>
                          {formatDuration(message.duration)}
                        </Typography>
                        {message.isScheduled && message.scheduledFor && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Schedule sx={{ fontSize: 16, color: '#fbbf24' }} />
                            <Typography variant="body2" sx={{ color: '#fbbf24' }}>
                              {formatDateTime(message.scheduledFor)}
                            </Typography>
                          </Box>
                        )}
                        {message.analytics && (
                          <Typography variant="body2" sx={{ color: '#71717a' }}>
                            {message.analytics.playCount} plays
                          </Typography>
                        )}
                      </Box>
                      <Typography variant="body2" sx={{ color: '#71717a' }}>
                        {formatDate(message.createdAt)}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ pt: 0 }}>
                    <IconButton
                      onClick={() => handlePlayPause(message)}
                      sx={{
                        background: currentlyPlaying === message._id 
                          ? 'rgba(239, 68, 68, 0.2)' 
                          : 'rgba(99, 102, 241, 0.2)',
                        color: currentlyPlaying === message._id ? '#ef4444' : '#6366f1',
                        '&:hover': {
                          background: currentlyPlaying === message._id 
                            ? 'rgba(239, 68, 68, 0.3)' 
                            : 'rgba(99, 102, 241, 0.3)',
                        }
                      }}
                    >
                      {currentlyPlaying === message._id ? <Pause /> : <PlayArrow />}
                    </IconButton>
                    
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedMessage(message);
                        setDetailDialogOpen(true);
                      }}
                      sx={{ color: '#6366f1' }}
                    >
                      View Details
                    </Button>
                    
                    <IconButton
                      size="small"
                      onClick={() => handleArchiveMessage(message._id, message.status !== 'archived')}
                      sx={{ color: message.status === 'archived' ? '#10b981' : '#a1a1aa' }}
                    >
                      {message.status === 'archived' ? <Unarchive /> : <Archive />}
                    </IconButton>
                    
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedMessage(message);
                        setDeleteDialogOpen(true);
                      }}
                      sx={{ color: '#ef4444' }}
                    >
                      <Delete />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Message Detail Dialog */}
        <Dialog
          open={detailDialogOpen}
          onClose={() => setDetailDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{
            background: 'rgba(30, 30, 50, 0.9)',
            color: '#fff',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Typography variant="h6">
              Message Details
            </Typography>
          </DialogTitle>
          
          <DialogContent sx={{
            background: 'rgba(30, 30, 50, 0.9)',
            color: '#fff',
            pt: 3
          }}>
            {selectedMessage && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  {selectedMessage.title}
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ color: '#a1a1aa', mb: 1 }}>
                      Recipient Information
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Name:</strong> {selectedMessage.recipientName}
                    </Typography>
                    {selectedMessage.recipientRelationship && (
                      <Typography variant="body1" gutterBottom>
                        <strong>Relationship:</strong> {selectedMessage.recipientRelationship}
                      </Typography>
                    )}
                    {selectedMessage.recipientEmail && (
                      <Typography variant="body1" gutterBottom>
                        <strong>Email:</strong> {selectedMessage.recipientEmail}
                      </Typography>
                    )}
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ color: '#a1a1aa', mb: 1 }}>
                      Message Information
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Type:</strong> {selectedMessage.messageType}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Status:</strong> {selectedMessage.status}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Duration:</strong> {formatDuration(selectedMessage.duration)}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Created:</strong> {formatDateTime(selectedMessage.createdAt)}
                    </Typography>
                  </Grid>
                </Grid>
                
                {selectedMessage.description && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" sx={{ color: '#a1a1aa', mb: 1 }}>
                      Description
                    </Typography>
                    <Typography variant="body1">
                      {selectedMessage.description}
                    </Typography>
                  </Box>
                )}
                
                {selectedMessage.tags.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" sx={{ color: '#a1a1aa', mb: 1 }}>
                      Tags
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {selectedMessage.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          sx={{
                            background: 'rgba(99, 102, 241, 0.2)',
                            color: '#6366f1'
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
                
                {selectedMessage.analytics && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" sx={{ color: '#a1a1aa', mb: 1 }}>
                      Analytics
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="body2" sx={{ color: '#71717a' }}>
                          Play Count
                        </Typography>
                        <Typography variant="h6">
                          {selectedMessage.analytics.playCount}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" sx={{ color: '#71717a' }}>
                          Favorites
                        </Typography>
                        <Typography variant="h6">
                          {selectedMessage.analytics.favoriteCount}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" sx={{ color: '#71717a' }}>
                          Shares
                        </Typography>
                        <Typography variant="h6">
                          {selectedMessage.analytics.shareCount}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          
          <DialogActions sx={{
            background: 'rgba(30, 30, 50, 0.9)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            p: 2
          }}>
            <Button
              onClick={() => setDetailDialogOpen(false)}
              sx={{ color: '#a1a1aa' }}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setDetailDialogOpen(false);
                navigate(`/messages/edit/${selectedMessage?._id}`);
              }}
              sx={{
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#6366f1',
                '&:hover': {
                  background: 'rgba(99, 102, 241, 0.3)',
                }
              }}
            >
              Edit Message
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle sx={{
            background: 'rgba(30, 30, 50, 0.9)',
            color: '#fff'
          }}>
            Delete Message
          </DialogTitle>
          
          <DialogContent sx={{
            background: 'rgba(30, 30, 50, 0.9)',
            color: '#fff',
            pt: 2
          }}>
            <Typography>
              Are you sure you want to delete "{selectedMessage?.title}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          
          <DialogActions sx={{
            background: 'rgba(30, 30, 50, 0.9)',
            p: 2
          }}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              sx={{ color: '#a1a1aa' }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedMessage && handleDeleteMessage(selectedMessage._id)}
              sx={{
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                '&:hover': {
                  background: 'rgba(239, 68, 68, 0.3)',
                }
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default MessageLibrary; 
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Fade,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Fab,
  Tooltip
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Download,
  Share,
  Book,
  AutoStories,
  Favorite,
  FavoriteBorder,
  Visibility,
  VisibilityOff,
  Star,
  StarBorder
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface LegacyBook {
  _id: string;
  title: string;
  description: string;
  coverImage?: string;
  stories: string[];
  messages: string[];
  isPublic: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
  theme: 'classic' | 'modern' | 'vintage' | 'minimal';
  dedication?: string;
  acknowledgments?: string;
}

interface Story {
  _id: string;
  title: string;
  category: string;
  duration: string;
  date: string;
}

interface Message {
  _id: string;
  title: string;
  type: string;
  recipient: {
    name: string;
    relationship: string;
  };
  date: string;
}

const LegacyBooks: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [books, setBooks] = useState<LegacyBook[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState<LegacyBook | null>(null);
  const [filter, setFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    theme: 'classic' as LegacyBook['theme'],
    isPublic: false,
    dedication: '',
    acknowledgments: '',
    selectedStories: [] as string[],
    selectedMessages: [] as string[]
  });

  // Load data
  useEffect(() => {
    loadBooks();
    loadStories();
    loadMessages();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await fetch('/api/legacy-books', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBooks(data.books || []);
      } else {
        setError('Failed to load legacy books');
      }
    } catch (error) {
      setError('Failed to load legacy books');
    } finally {
      setLoading(false);
    }
  };

  const loadStories = async () => {
    try {
      const response = await fetch('/api/stories', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStories(data.stories || []);
      }
    } catch (error) {
      console.error('Failed to load stories:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/messages', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleCreateBook = async () => {
    try {
      const response = await fetch('/api/legacy-books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          stories: formData.selectedStories,
          messages: formData.selectedMessages
        })
      });

      if (response.ok) {
        setShowCreateDialog(false);
        resetForm();
        loadBooks();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create legacy book');
      }
    } catch (error) {
      setError('Failed to create legacy book');
    }
  };

  const handleUpdateBook = async () => {
    if (!selectedBook) return;

    try {
      const response = await fetch(`/api/legacy-books/${selectedBook._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          stories: formData.selectedStories,
          messages: formData.selectedMessages
        })
      });

      if (response.ok) {
        setShowEditDialog(false);
        setSelectedBook(null);
        resetForm();
        loadBooks();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update legacy book');
      }
    } catch (error) {
      setError('Failed to update legacy book');
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!window.confirm('Are you sure you want to delete this legacy book?')) return;

    try {
      const response = await fetch(`/api/legacy-books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        loadBooks();
      } else {
        setError('Failed to delete legacy book');
      }
    } catch (error) {
      setError('Failed to delete legacy book');
    }
  };

  const handleToggleFavorite = async (bookId: string) => {
    try {
      const response = await fetch(`/api/legacy-books/${bookId}/favorite`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        loadBooks();
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleDownloadBook = async (bookId: string) => {
    try {
      const response = await fetch(`/api/legacy-books/${bookId}/pdf`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `legacy-book-${bookId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError('Failed to download book');
      }
    } catch (error) {
      setError('Failed to download book');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      theme: 'classic',
      isPublic: false,
      dedication: '',
      acknowledgments: '',
      selectedStories: [],
      selectedMessages: []
    });
  };

  const openEditDialog = (book: LegacyBook) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      description: book.description,
      theme: book.theme,
      isPublic: book.isPublic,
      dedication: book.dedication || '',
      acknowledgments: book.acknowledgments || '',
      selectedStories: book.stories,
      selectedMessages: book.messages
    });
    setShowEditDialog(true);
  };

  const filteredBooks = books.filter(book => {
    if (filter === 'all') return true;
    return book.status === filter;
  });

  const getThemeColor = (theme: LegacyBook['theme']) => {
    switch (theme) {
      case 'classic': return '#8B4513';
      case 'modern': return '#2C3E50';
      case 'vintage': return '#D2691E';
      case 'minimal': return '#34495E';
      default: return '#6366f1';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
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
              Legacy Books
            </Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
              Compile your stories and messages into beautiful, lasting books
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowCreateDialog(true)}
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              }
            }}
          >
            Create Legacy Book
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Filter Tabs */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {(['all', 'draft', 'published', 'archived'] as const).map((status) => (
              <Chip
                key={status}
                label={status.charAt(0).toUpperCase() + status.slice(1)}
                onClick={() => setFilter(status)}
                sx={{
                  background: filter === status ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  color: filter === status ? '#6366f1' : '#a1a1aa',
                  '&:hover': {
                    background: filter === status ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                  }
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <Card sx={{
            background: 'rgba(30, 30, 50, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff'
          }}>
            <CardContent sx={{ textAlign: 'center', p: 6 }}>
              <Box sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#6366f1',
                mb: 3
              }}>
                <Book sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                No Legacy Books Yet
              </Typography>
              <Typography variant="body2" sx={{ color: '#a1a1aa', mb: 3 }}>
                Create your first legacy book to preserve your stories and messages
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowCreateDialog(true)}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  }
                }}
              >
                Create Your First Book
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {filteredBooks.map((book) => (
              <Grid item xs={12} md={6} lg={4} key={book._id}>
                <Fade in timeout={300}>
                  <Card sx={{
                    background: 'rgba(30, 30, 50, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                    }
                  }}>
                    <CardContent sx={{ flex: 1, p: 3 }}>
                      {/* Book Cover */}
                      <Box sx={{
                        height: 200,
                        background: `linear-gradient(135deg, ${getThemeColor(book.theme)} 0%, ${getThemeColor(book.theme)}80 100%)`,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <Book sx={{ fontSize: 60, color: 'rgba(255, 255, 255, 0.8)' }} />
                        <Box sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          display: 'flex',
                          gap: 1
                        }}>
                          {book.isFavorite && (
                            <Star sx={{ color: '#fbbf24', fontSize: 20 }} />
                          )}
                          {book.isPublic ? (
                            <Visibility sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 20 }} />
                          ) : (
                            <VisibilityOff sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 20 }} />
                          )}
                        </Box>
                      </Box>

                      {/* Book Info */}
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {book.title}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ color: '#a1a1aa', mb: 2, minHeight: 40 }}>
                        {book.description}
                      </Typography>

                      {/* Stats */}
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Chip
                          label={`${book.stories.length} stories`}
                          size="small"
                          sx={{ background: 'rgba(99, 102, 241, 0.2)', color: '#6366f1' }}
                        />
                        <Chip
                          label={`${book.messages.length} messages`}
                          size="small"
                          sx={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}
                        />
                      </Box>

                      {/* Status */}
                      <Chip
                        label={book.status}
                        size="small"
                        sx={{
                          background: book.status === 'published' ? 'rgba(16, 185, 129, 0.2)' :
                                    book.status === 'draft' ? 'rgba(245, 158, 11, 0.2)' :
                                    'rgba(107, 114, 128, 0.2)',
                          color: book.status === 'published' ? '#10b981' :
                                 book.status === 'draft' ? '#f59e0b' :
                                 '#6b7280',
                          mb: 2
                        }}
                      />

                      {/* Actions */}
                      <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleFavorite(book._id)}
                          sx={{ color: book.isFavorite ? '#fbbf24' : '#a1a1aa' }}
                        >
                          {book.isFavorite ? <Star /> : <StarBorder />}
                        </IconButton>
                        
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/legacy-books/${book._id}`)}
                          sx={{ color: '#6366f1' }}
                        >
                          <AutoStories />
                        </IconButton>
                        
                        <IconButton
                          size="small"
                          onClick={() => openEditDialog(book)}
                          sx={{ color: '#f59e0b' }}
                        >
                          <Edit />
                        </IconButton>
                        
                        <IconButton
                          size="small"
                          onClick={() => handleDownloadBook(book._id)}
                          sx={{ color: '#10b981' }}
                        >
                          <Download />
                        </IconButton>
                        
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteBook(book._id)}
                          sx={{ color: '#ef4444' }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Create/Edit Dialog */}
        <Dialog 
          open={showCreateDialog || showEditDialog} 
          onClose={() => {
            setShowCreateDialog(false);
            setShowEditDialog(false);
            setSelectedBook(null);
            resetForm();
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            background: 'rgba(30, 30, 50, 0.9)', 
            color: '#fff',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {showCreateDialog ? 'Create Legacy Book' : 'Edit Legacy Book'}
          </DialogTitle>
          
          <DialogContent sx={{ 
            background: 'rgba(30, 30, 50, 0.9)', 
            color: '#fff',
            pt: 3
          }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Book Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '& input': { color: '#fff' },
                      '& label': { color: '#a1a1aa' },
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '& textarea': { color: '#fff' },
                      '& label': { color: '#a1a1aa' },
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#a1a1aa' }}>Theme</InputLabel>
                  <Select
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value as LegacyBook['theme'] })}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '& .MuiSelect-icon': { color: '#a1a1aa' },
                    }}
                  >
                    <MenuItem value="classic">Classic</MenuItem>
                    <MenuItem value="modern">Modern</MenuItem>
                    <MenuItem value="vintage">Vintage</MenuItem>
                    <MenuItem value="minimal">Minimal</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Dedication (Optional)"
                  multiline
                  rows={2}
                  value={formData.dedication}
                  onChange={(e) => setFormData({ ...formData, dedication: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '& textarea': { color: '#fff' },
                      '& label': { color: '#a1a1aa' },
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Select Stories ({formData.selectedStories.length} selected)
                </Typography>
                <Paper sx={{ 
                  maxHeight: 200, 
                  overflow: 'auto',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <List dense>
                    {stories.map((story) => (
                      <ListItem key={story._id}>
                        <Checkbox
                          checked={formData.selectedStories.includes(story._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                selectedStories: [...formData.selectedStories, story._id]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                selectedStories: formData.selectedStories.filter(id => id !== story._id)
                              });
                            }
                          }}
                          sx={{ color: '#6366f1' }}
                        />
                        <ListItemText
                          primary={story.title}
                          secondary={`${story.category} • ${story.duration}`}
                          sx={{ color: '#fff' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Select Messages ({formData.selectedMessages.length} selected)
                </Typography>
                <Paper sx={{ 
                  maxHeight: 200, 
                  overflow: 'auto',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <List dense>
                    {messages.map((message) => (
                      <ListItem key={message._id}>
                        <Checkbox
                          checked={formData.selectedMessages.includes(message._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                selectedMessages: [...formData.selectedMessages, message._id]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                selectedMessages: formData.selectedMessages.filter(id => id !== message._id)
                              });
                            }
                          }}
                          sx={{ color: '#6366f1' }}
                        />
                        <ListItemText
                          primary={message.title}
                          secondary={`${message.type} • To: ${message.recipient.name}`}
                          sx={{ color: '#fff' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ 
            background: 'rgba(30, 30, 50, 0.9)', 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            p: 2
          }}>
            <Button 
              onClick={() => {
                setShowCreateDialog(false);
                setShowEditDialog(false);
                setSelectedBook(null);
                resetForm();
              }}
              sx={{ color: '#a1a1aa' }}
            >
              Cancel
            </Button>
            <Button
              onClick={showCreateDialog ? handleCreateBook : handleUpdateBook}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                }
              }}
            >
              {showCreateDialog ? 'Create Book' : 'Update Book'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default LegacyBooks; 
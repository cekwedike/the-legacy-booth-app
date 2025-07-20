import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Grid,
  Fab,
  useTheme,
  useMediaQuery,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add,
  Search,
  Book,
  Edit,
  Delete,
  Visibility,
  Download,
  Share,
  Favorite,
  FavoriteBorder,
  MoreVert,
  LibraryBooks,
  Message,
  AccessTime,
  Palette
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppStore, LegacyBook } from '../../store';

const LegacyBooks: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  // Zustand store
  const legacyBooks = useAppStore(s => s.legacyBooks);

  const statuses = [
    'All Status',
    'draft',
    'published'
  ];

  const themes = [
    'All Themes',
    'classic',
    'modern',
    'vintage',
    'elegant'
  ];

  const toggleFavorite = (bookId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(bookId)) {
      newFavorites.delete(bookId);
    } else {
      newFavorites.add(bookId);
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
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredBooks = legacyBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (book.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || book.status === selectedStatus;
    const matchesTheme = selectedTheme === 'all' || book.theme === selectedTheme;
    return matchesSearch && matchesStatus && matchesTheme;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'stories':
        return b.storiesCount - a.storiesCount;
      case 'messages':
        return b.messagesCount - a.messagesCount;
      default:
        return 0;
    }
  });

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
              Legacy Books
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
              {sortedBooks.length} books • {favorites.size} favorites
            </Typography>
          </Box>
          <Fab
            color="primary"
            aria-label="create legacy book"
            onClick={() => navigate('/legacy-books/create')}
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
              <Grid item xs={12} md={4}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: theme.palette.text.primary }}>
                  Search Books
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Search by title or description..."
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
              <Grid item xs={12} md={2}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: theme.palette.text.primary }}>
                  Status
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    {statuses.map((status) => (
                      <MenuItem key={status} value={status === 'All Status' ? 'all' : status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: theme.palette.text.primary }}>
                  Theme
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={selectedTheme}
                    onChange={(e) => setSelectedTheme(e.target.value)}
                  >
                    {themes.map((theme) => (
                      <MenuItem key={theme} value={theme === 'All Themes' ? 'all' : theme}>
                        {theme}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: theme.palette.text.primary }}>
                  Sort By
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="date">Date</MenuItem>
                    <MenuItem value="title">Title</MenuItem>
                    <MenuItem value="stories">Stories</MenuItem>
                    <MenuItem value="messages">Messages</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Books Grid */}
        <Grid container spacing={3}>
          {sortedBooks.map((book) => (
            <Grid item xs={12} sm={6} lg={4} key={book._id}>
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
                        {book.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip 
                          label={book.theme} 
                          size="small" 
                          color={getThemeColor(book.theme) as any}
                          sx={{ 
                            fontSize: '0.7rem',
                            fontWeight: 600
                          }}
                        />
                        <Chip 
                          label={book.status} 
                          size="small" 
                          color={getStatusColor(book.status) as any}
                          sx={{ 
                            fontSize: '0.7rem',
                            fontWeight: 600
                          }}
                        />
                      </Box>
                    </Box>
                    <IconButton 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(book._id);
                      }}
                    >
                      {favorites.has(book._id) ? 
                        <Favorite sx={{ color: '#ef4444', fontSize: 20 }} /> : 
                        <FavoriteBorder sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
                      }
                    </IconButton>
                  </Box>

                  {/* Description */}
                  {book.description && (
                    <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.5, color: theme.palette.text.secondary }}>
                      {book.description}
                    </Typography>
                  )}

                  {/* Stats */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LibraryBooks sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        {book.storiesCount} stories
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Message sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        {book.messagesCount} messages
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTime sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        {formatDate(book.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                    <Button
                      variant="contained"
                      startIcon={<Visibility />}
                      onClick={() => navigate(`/legacy-books/${book._id}`)}
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
                      View Book
                    </Button>
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
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Empty State */}
        {sortedBooks.length === 0 && (
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
                <Book sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                No legacy books found
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: theme.palette.text.secondary }}>
                {searchTerm || selectedStatus !== 'all' || selectedTheme !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Start creating your first legacy book to preserve your stories and messages'
                }
              </Typography>
              {!searchTerm && selectedStatus === 'all' && selectedTheme === 'all' && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => navigate('/legacy-books/create')}
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
                  Create Your First Legacy Book
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default LegacyBooks; 
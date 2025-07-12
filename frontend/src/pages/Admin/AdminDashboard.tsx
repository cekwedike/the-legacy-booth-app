import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  LinearProgress,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  People,
  Book,
  Message,
  TrendingUp,
  Warning,
  CheckCircle,
  Block,
  Edit,
  Visibility,
  Refresh,
  Settings,
  Speed,
  Storage as StorageIcon,
  NetworkCheck,
  Dashboard as DashboardIcon,
  AccessTime,
  PersonAdd,
  Flag,
  Report,
  AutoAwesome,
  ContentCopy,
  Security
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalStories: number;
  totalMessages: number;
  totalLegacyBooks: number;
  systemHealth: {
    cpu: number;
    memory: number;
    storage: number;
    uptime: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'user' | 'story' | 'message' | 'system';
    action: string;
    timestamp: string;
    user?: string;
  }>;
  userGrowth: Array<{
    date: string;
    users: number;
  }>;
  contentStats: Array<{
    category: string;
    count: number;
    color: string;
  }>;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
  lastLogin?: string;
  storiesCount: number;
  messagesCount: number;
}

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
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
    
    if (autoRefresh) {
      const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
      setRefreshInterval(interval);
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [autoRefresh]);

  const loadDashboardData = async () => {
    try {
      setError('');
      const token = localStorage.getItem('token');
      
      // Load dashboard stats
      const statsResponse = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Load users
      const usersResponse = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: 'suspend' | 'activate' | 'delete', role?: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role })
      });

      if (response.ok) {
        loadDashboardData();
        setUserDialogOpen(false);
        setSelectedUser(null);
      } else {
        setError('Failed to update user');
      }
    } catch (error) {
      setError('Failed to update user');
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'suspended': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'error';
      case 'moderator': return 'warning';
      case 'user': return 'primary';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
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
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ color: '#fff', mb: 1 }}>
              Admin Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
              System overview and management
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#6366f1',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#6366f1',
                    },
                  }}
                />
              }
              label="Auto Refresh"
              sx={{ color: '#fff' }}
            />
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={loadDashboardData}
              sx={{
                borderColor: '#6366f1',
                color: '#6366f1',
                '&:hover': {
                  borderColor: '#8b5cf6',
                  color: '#8b5cf6',
                }
              }}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        {stats && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                background: 'rgba(30, 30, 50, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6" sx={{ color: '#a1a1aa', mb: 1 }}>
                        Total Users
                      </Typography>
                      <Typography variant="h3" sx={{ color: '#6366f1' }}>
                        {stats.totalUsers.toLocaleString()}
                      </Typography>
                    </Box>
                    <People sx={{ fontSize: 40, color: '#6366f1' }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <TrendingUp sx={{ fontSize: 16, color: '#10b981', mr: 0.5 }} />
                    <Typography variant="body2" sx={{ color: '#10b981' }}>
                      +{stats.activeUsers} active
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                background: 'rgba(30, 30, 50, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6" sx={{ color: '#a1a1aa', mb: 1 }}>
                        Total Stories
                      </Typography>
                      <Typography variant="h3" sx={{ color: '#8b5cf6' }}>
                        {stats.totalStories.toLocaleString()}
                      </Typography>
                    </Box>
                    <Book sx={{ fontSize: 40, color: '#8b5cf6' }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <TrendingUp sx={{ fontSize: 16, color: '#10b981', mr: 0.5 }} />
                    <Typography variant="body2" sx={{ color: '#10b981' }}>
                      Growing daily
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                background: 'rgba(30, 30, 50, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6" sx={{ color: '#a1a1aa', mb: 1 }}>
                        Total Messages
                      </Typography>
                      <Typography variant="h3" sx={{ color: '#f59e0b' }}>
                        {stats.totalMessages.toLocaleString()}
                      </Typography>
                    </Box>
                    <Message sx={{ fontSize: 40, color: '#f59e0b' }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <TrendingUp sx={{ fontSize: 16, color: '#10b981', mr: 0.5 }} />
                    <Typography variant="body2" sx={{ color: '#10b981' }}>
                      Active sharing
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                background: 'rgba(30, 30, 50, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6" sx={{ color: '#a1a1aa', mb: 1 }}>
                        Legacy Books
                      </Typography>
                      <Typography variant="h3" sx={{ color: '#ef4444' }}>
                        {stats.totalLegacyBooks.toLocaleString()}
                      </Typography>
                    </Box>
                    <AutoAwesome sx={{ fontSize: 40, color: '#ef4444' }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <TrendingUp sx={{ fontSize: 16, color: '#10b981', mr: 0.5 }} />
                    <Typography variant="body2" sx={{ color: '#10b981' }}>
                      Preserving memories
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* System Health */}
        {stats && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{
                background: 'rgba(30, 30, 50, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff'
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    System Health
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">CPU Usage</Typography>
                      <Typography variant="body2">{stats.systemHealth.cpu}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={stats.systemHealth.cpu}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: stats.systemHealth.cpu > 80 ? '#ef4444' : '#10b981'
                        }
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Memory Usage</Typography>
                      <Typography variant="body2">{stats.systemHealth.memory}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={stats.systemHealth.memory}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: stats.systemHealth.memory > 80 ? '#ef4444' : '#10b981'
                        }
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Storage Usage</Typography>
                      <Typography variant="body2">{stats.systemHealth.storage}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={stats.systemHealth.storage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: stats.systemHealth.storage > 80 ? '#ef4444' : '#10b981'
                        }
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime sx={{ fontSize: 16, color: '#a1a1aa' }} />
                    <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
                      Uptime: {formatUptime(stats.systemHealth.uptime)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{
                background: 'rgba(30, 30, 50, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff'
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Content Distribution
                  </Typography>
                  
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={stats.contentStats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                                                 label={({ category, percent }) => `${category} ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {stats.contentStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Tabs */}
        <Card sx={{
          background: 'rgba(30, 30, 50, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#fff'
        }}>
          <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  color: '#a1a1aa',
                  '&.Mui-selected': {
                    color: '#6366f1',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#6366f1',
                },
              }}
            >
                             <Tab icon={<DashboardIcon />} label="Overview" />
               <Tab icon={<People />} label="Users" />
               <Tab icon={<ContentCopy />} label="Content" />
               <Tab icon={<Security />} label="System" />
            </Tabs>
          </Box>

          {/* Overview Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {/* User Growth Chart */}
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    User Growth
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats?.userGrowth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#a1a1aa"
                        tick={{ fill: '#a1a1aa' }}
                      />
                      <YAxis 
                        stroke="#a1a1aa"
                        tick={{ fill: '#a1a1aa' }}
                      />
                      <RechartsTooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(30, 30, 50, 0.9)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#fff'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="users" 
                        stroke="#6366f1" 
                        strokeWidth={2}
                        dot={{ fill: '#6366f1' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Grid>

                {/* Recent Activity */}
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Recent Activity
                  </Typography>
                  <List>
                    {stats?.recentActivity.slice(0, 5).map((activity) => (
                      <ListItem key={activity.id} sx={{ px: 0 }}>
                                                 <ListItemIcon>
                           {activity.type === 'user' && <People sx={{ color: '#6366f1' }} />}
                           {activity.type === 'story' && <Book sx={{ color: '#8b5cf6' }} />}
                           {activity.type === 'message' && <Message sx={{ color: '#f59e0b' }} />}
                           {activity.type === 'system' && <Settings sx={{ color: '#ef4444' }} />}
                         </ListItemIcon>
                        <ListItemText
                          primary={activity.action}
                          secondary={formatDate(activity.timestamp)}
                          sx={{
                            '& .MuiListItemText-primary': { color: '#fff' },
                            '& .MuiListItemText-secondary': { color: '#a1a1aa' }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          {/* Users Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  User Management
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<PersonAdd />}
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    }
                  }}
                >
                  Add User
                </Button>
              </Box>

              <TableContainer component={Paper} sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#fff'
              }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#a1a1aa' }}>User</TableCell>
                      <TableCell sx={{ color: '#a1a1aa' }}>Role</TableCell>
                      <TableCell sx={{ color: '#a1a1aa' }}>Status</TableCell>
                      <TableCell sx={{ color: '#a1a1aa' }}>Content</TableCell>
                      <TableCell sx={{ color: '#a1a1aa' }}>Joined</TableCell>
                      <TableCell sx={{ color: '#a1a1aa' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <Box>
                            <Typography variant="body1" sx={{ color: '#fff' }}>
                              {user.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
                              {user.email}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.role}
                            color={getRoleColor(user.role) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.status}
                            color={getStatusColor(user.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
                            {user.storiesCount} stories, {user.messagesCount} messages
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
                            {formatDate(user.createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setUserDialogOpen(true);
                                }}
                                sx={{ color: '#6366f1' }}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit User">
                              <IconButton
                                size="small"
                                sx={{ color: '#f59e0b' }}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={user.status === 'active' ? 'Suspend User' : 'Activate User'}>
                              <IconButton
                                size="small"
                                onClick={() => handleUserAction(
                                  user._id, 
                                  user.status === 'active' ? 'suspend' : 'activate'
                                )}
                                sx={{ color: user.status === 'active' ? '#ef4444' : '#10b981' }}
                              >
                                {user.status === 'active' ? <Block /> : <CheckCircle />}
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </TabPanel>

          {/* Content Tab */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Content Moderation
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff'
                  }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Pending Reviews
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <Flag sx={{ color: '#f59e0b' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="3 stories flagged for review"
                            secondary="Last 24 hours"
                            sx={{
                              '& .MuiListItemText-primary': { color: '#fff' },
                              '& .MuiListItemText-secondary': { color: '#a1a1aa' }
                            }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Report sx={{ color: '#ef4444' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="1 message reported"
                            secondary="Awaiting moderation"
                            sx={{
                              '& .MuiListItemText-primary': { color: '#fff' },
                              '& .MuiListItemText-secondary': { color: '#a1a1aa' }
                            }}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff'
                  }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Content Stats
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
                          Total Content
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#fff' }}>
                          {(stats?.totalStories || 0) + (stats?.totalMessages || 0)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
                          Approved
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#10b981' }}>
                          99.2%
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
                          Pending Review
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#f59e0b' }}>
                          0.5%
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
                          Rejected
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#ef4444' }}>
                          0.3%
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          {/* System Tab */}
          <TabPanel value={tabValue} index={3}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                System Monitoring
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff'
                  }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Performance Metrics
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <Speed sx={{ color: '#6366f1' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Response Time"
                            secondary="Average: 120ms"
                            sx={{
                              '& .MuiListItemText-primary': { color: '#fff' },
                              '& .MuiListItemText-secondary': { color: '#a1a1aa' }
                            }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <NetworkCheck sx={{ color: '#10b981' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Uptime"
                            secondary="99.9% (Last 30 days)"
                            sx={{
                              '& .MuiListItemText-primary': { color: '#fff' },
                              '& .MuiListItemText-secondary': { color: '#a1a1aa' }
                            }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <StorageIcon sx={{ color: '#f59e0b' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Storage"
                            secondary={`${stats?.systemHealth.storage}% used`}
                            sx={{
                              '& .MuiListItemText-primary': { color: '#fff' },
                              '& .MuiListItemText-secondary': { color: '#a1a1aa' }
                            }}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff'
                  }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        System Alerts
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircle sx={{ color: '#10b981' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="All systems operational"
                            secondary="No issues detected"
                            sx={{
                              '& .MuiListItemText-primary': { color: '#fff' },
                              '& .MuiListItemText-secondary': { color: '#a1a1aa' }
                            }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Warning sx={{ color: '#f59e0b' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Backup scheduled"
                            secondary="Daily backup in 2 hours"
                            sx={{
                              '& .MuiListItemText-primary': { color: '#fff' },
                              '& .MuiListItemText-secondary': { color: '#a1a1aa' }
                            }}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>
        </Card>

        {/* User Details Dialog */}
        <Dialog
          open={userDialogOpen}
          onClose={() => setUserDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{
            background: 'rgba(30, 30, 50, 0.9)',
            color: '#fff',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            User Details
          </DialogTitle>
          
          <DialogContent sx={{
            background: 'rgba(30, 30, 50, 0.9)',
            color: '#fff',
            pt: 3
          }}>
            {selectedUser && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    User Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
                      Name
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#fff' }}>
                      {selectedUser.name}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
                      Email
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#fff' }}>
                      {selectedUser.email}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
                      Role
                    </Typography>
                    <Chip
                      label={selectedUser.role}
                      color={getRoleColor(selectedUser.role) as any}
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
                      Status
                    </Typography>
                    <Chip
                      label={selectedUser.status}
                      color={getStatusColor(selectedUser.status) as any}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Activity
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
                      Stories Created
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#fff' }}>
                      {selectedUser.storiesCount}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
                      Messages Sent
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#fff' }}>
                      {selectedUser.messagesCount}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
                      Joined
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#fff' }}>
                      {formatDate(selectedUser.createdAt)}
                    </Typography>
                  </Box>
                  {selectedUser.lastLogin && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
                        Last Login
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#fff' }}>
                        {formatDate(selectedUser.lastLogin)}
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            )}
          </DialogContent>
          
          <DialogActions sx={{
            background: 'rgba(30, 30, 50, 0.9)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            p: 2
          }}>
            <Button
              onClick={() => setUserDialogOpen(false)}
              sx={{ color: '#a1a1aa' }}
            >
              Close
            </Button>
            {selectedUser && (
              <>
                <Button
                  onClick={() => handleUserAction(
                    selectedUser._id,
                    selectedUser.status === 'active' ? 'suspend' : 'activate'
                  )}
                  sx={{
                    background: selectedUser.status === 'active' 
                      ? 'rgba(239, 68, 68, 0.2)' 
                      : 'rgba(16, 185, 129, 0.2)',
                    color: selectedUser.status === 'active' ? '#ef4444' : '#10b981',
                    '&:hover': {
                      background: selectedUser.status === 'active' 
                        ? 'rgba(239, 68, 68, 0.3)' 
                        : 'rgba(16, 185, 129, 0.3)',
                    }
                  }}
                >
                  {selectedUser.status === 'active' ? 'Suspend' : 'Activate'}
                </Button>
                <Button
                  onClick={() => handleUserAction(selectedUser._id, 'delete')}
                  sx={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    '&:hover': {
                      background: 'rgba(239, 68, 68, 0.3)',
                    }
                  }}
                >
                  Delete User
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default AdminDashboard; 
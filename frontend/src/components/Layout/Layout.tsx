import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Book,
  Message,
  VideoCall,
  Settings,
  Person,
  Logout,
  AdminPanelSettings,
  Notifications,
  Search,
  Star
} from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 280;

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = (): void => {
    setAnchorEl(null);
  };

  const handleLogout = (): void => {
    logout();
    navigate('/login');
    handleProfileMenuClose();
  };

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <Dashboard />, 
      path: '/dashboard',
      description: 'Your personal overview'
    },
    { 
      text: 'Stories', 
      icon: <Book />, 
      path: '/stories/library',
      description: 'Record and manage your stories',
      badge: 3
    },
    { 
      text: 'Messages', 
      icon: <Message />, 
      path: '/messages/library',
      description: 'Create messages for loved ones',
      badge: 1
    },
    { 
      text: 'Legacy Books', 
      icon: <Star />, 
      path: '/legacy-books',
      description: 'Compile your memories'
    },
    { 
      text: 'Video Call', 
      icon: <VideoCall />, 
      path: '/video-call',
      description: 'Connect with family'
    },
    { 
      text: 'Settings', 
      icon: <Settings />, 
      path: '/settings/profile',
      description: 'Customize your experience'
    }
  ];

  const adminMenuItems = [
    { 
      text: 'Admin Dashboard', 
      icon: <AdminPanelSettings />, 
      path: '/admin/dashboard',
      description: 'System overview'
    },
    { 
      text: 'User Management', 
      icon: <Person />, 
      path: '/admin/users',
      description: 'Manage residents'
    },
    { 
      text: 'Content Management', 
      icon: <Book />, 
      path: '/admin/content',
      description: 'Review and moderate'
    }
  ];

  const getPageTitle = () => {
    if (location.pathname === '/dashboard') return 'Welcome Back';
    if (location.pathname.includes('/stories')) return 'Your Stories';
    if (location.pathname.includes('/messages')) return 'Messages';
    if (location.pathname.includes('/legacy-books')) return 'Legacy Books';
    if (location.pathname.includes('/video-call')) return 'Video Call';
    if (location.pathname.includes('/settings')) return 'Settings';
    if (location.pathname.includes('/admin')) return 'Admin Panel';
    return 'The Legacy Booth';
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Legacy Booth
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Preserve Your Story
        </Typography>
      </Box>

      {/* User Info */}
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ 
              width: 48, 
              height: 48,
              background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
              fontSize: '1.2rem',
              fontWeight: 600
            }}
          >
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {user?.name || 'User'}
            </Typography>
            <Chip 
              label={user?.role || 'resident'} 
              size="small" 
              sx={{ 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                fontSize: '0.7rem',
                height: 20
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ pt: 1 }}>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                mx: 1,
                mb: 1,
                borderRadius: 3,
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                '&:hover': {
                  background: 'rgba(99, 102, 241, 0.1)',
                  transform: 'translateX(4px)',
                },
                transition: 'all 0.2s ease-in-out',
                cursor: 'pointer',
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <ListItemText 
                    primary={item.text} 
                    secondary={item.description}
                    primaryTypographyProps={{ fontWeight: 600 }}
                    secondaryTypographyProps={{ fontSize: '0.75rem' }}
                  />
                  {item.badge && (
                    <Badge 
                      badgeContent={item.badge} 
                      color="error"
                      sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem' } }}
                    />
                  )}
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>

        {user?.role === 'admin' && (
          <>
            <Divider sx={{ mx: 2, my: 2 }} />
            <Typography variant="overline" sx={{ px: 3, py: 1, color: 'text.secondary', fontWeight: 600 }}>
              Admin Tools
            </Typography>
            <List>
              {adminMenuItems.map((item) => (
                <ListItem
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    mx: 1,
                    mb: 1,
                    borderRadius: 3,
                    '&.Mui-selected': {
                      background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #d97706 0%, #ea580c 100%)',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'white',
                      },
                    },
                    '&:hover': {
                      background: 'rgba(245, 158, 11, 0.1)',
                      transform: 'translateX(4px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                    cursor: 'pointer',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    secondary={item.description}
                    primaryTypographyProps={{ fontWeight: 600 }}
                    secondaryTypographyProps={{ fontSize: '0.75rem' }}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {getPageTitle()}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit" size="large">
              <Search />
            </IconButton>
            <IconButton color="inherit" size="large">
              <Badge badgeContent={4} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{ ml: 1 }}
            >
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              >
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
              borderRight: 'none',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Outlet />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            mt: 1,
            minWidth: 200,
          }
        }}
      >
        <MenuItem onClick={() => navigate('/settings/profile')}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Layout; 
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
  Tooltip,
  Button,
  useTheme,
  useMediaQuery,
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
  Star,
  ChevronLeft,
  ChevronRight,
  Mic,
  LightMode,
  DarkMode,
} from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme as useAppTheme } from '../../contexts/ThemeContext';

// Add CSS animations
const globalStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
  }
  
  @keyframes fadeIn {
    0% { opacity: 0; transform: translateX(10px); }
    100% { opacity: 1; transform: translateX(0); }
  }
`;

const drawerWidth = 280;
const collapsedDrawerWidth = 120;

interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
  description: string;
  badge?: number;
}

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useAppTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isTablet = useMediaQuery(muiTheme.breakpoints.down('lg'));

  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = (): void => {
    setSidebarCollapsed(!sidebarCollapsed);
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

  const menuItems: MenuItem[] = [
    { 
      text: 'Dashboard', 
      icon: <Dashboard />, 
      path: '/dashboard',
      description: 'Your personal overview'
    },
    { 
      text: 'Stories', 
      icon: <Mic />, 
      path: '/stories/library',
      description: 'Record and manage your stories'
    },
    { 
      text: 'Messages', 
      icon: <Message />, 
      path: '/messages/library',
      description: 'Create messages for loved ones'
    },
    { 
      text: 'Legacy Books', 
      icon: <Book />, 
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

  const adminMenuItems: MenuItem[] = [
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
    if (location.pathname === '/dashboard') return 'Legacy Booth';
    if (location.pathname.includes('/stories')) return 'Your Stories';
    if (location.pathname.includes('/messages')) return 'Messages';
    if (location.pathname.includes('/legacy-books')) return 'Legacy Books';
    if (location.pathname.includes('/video-call')) return 'Video Call';
    if (location.pathname.includes('/settings')) return 'Settings';
    if (location.pathname.includes('/admin')) return 'Admin Panel';
    return 'The Legacy Booth';
  };

  const renderMenuItem = (item: MenuItem, isAdmin: boolean = false) => {
    // Improved selection logic to handle sub-routes and different path structures
    const isSelected = (() => {
      const currentPath = location.pathname;
      const itemPath = item.path;
      
      // Debug logging
      console.log(`Checking ${item.text}: currentPath=${currentPath}, itemPath=${itemPath}`);
      
      // Exact match
      if (currentPath === itemPath) {
        console.log(`✓ Exact match for ${item.text}`);
        return true;
      }
      
      // Handle dashboard as root
      if (itemPath === '/dashboard' && (currentPath === '/' || currentPath === '/dashboard')) {
        console.log(`✓ Dashboard match for ${item.text}`);
        return true;
      }
      
      // Handle stories section
      if (itemPath === '/stories/library' && currentPath.includes('/stories')) {
        console.log(`✓ Stories match for ${item.text}`);
        return true;
      }
      
      // Handle messages section
      if (itemPath === '/messages/library' && currentPath.includes('/messages')) {
        console.log(`✓ Messages match for ${item.text}`);
        return true;
      }
      
      // Handle settings section
      if (itemPath === '/settings/profile' && currentPath.includes('/settings')) {
        console.log(`✓ Settings match for ${item.text}`);
        return true;
      }
      
      // Handle admin section
      if (itemPath === '/admin/dashboard' && currentPath.includes('/admin')) {
        console.log(`✓ Admin match for ${item.text}`);
        return true;
      }
      
      // Handle legacy books section
      if (itemPath === '/legacy-books' && currentPath.includes('/legacy-books')) {
        console.log(`✓ Legacy Books match for ${item.text}`);
        return true;
      }
      
      // Handle video call section
      if (itemPath === '/video-call' && currentPath.includes('/video-call')) {
        console.log(`✓ Video Call match for ${item.text}`);
        return true;
      }
      
      console.log(`✗ No match for ${item.text}`);
      return false;
    })();
    
    const isCollapsed = sidebarCollapsed && !mobileOpen;

    return (
      <Tooltip 
        title={isCollapsed ? item.text : ''} 
        placement="right"
        disableHoverListener={!isCollapsed}
      >
        <ListItem
          key={item.text}
          onClick={() => {
            navigate(item.path);
            if (mobileOpen) setMobileOpen(false);
          }}
          selected={isSelected}
          sx={{
            mx: isCollapsed ? 0.5 : { xs: 0.5, sm: 1, md: 1.5 },
            mb: { xs: 0.5, sm: 1 },
            borderRadius: isCollapsed ? '12px' : { xs: '12px', sm: '16px' },
            p: isCollapsed ? 1.5 : { xs: 1.5, sm: 2, md: 2.5 },
            width: isCollapsed ? 'auto' : { xs: '100%', sm: '92%' },
            minHeight: isCollapsed ? 48 : { xs: 48, sm: 56, md: 64 },
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            position: 'relative',
            zIndex: isSelected ? 2 : 1,
            background: isSelected 
              ? 'linear-gradient(135deg, #059669 0%, #10b981 100%) !important' 
              : 'transparent',
            color: isSelected ? 'white !important' : muiTheme.palette.text.secondary,
            boxShadow: isSelected 
              ? '0 4px 20px rgba(16,185,129,0.25) !important' 
              : 'none',
            '&:hover': {
              background: isSelected 
                ? 'linear-gradient(135deg, #047857 0%, #059669 100%) !important' 
                : muiTheme.palette.mode === 'dark' 
                  ? 'rgba(16, 185, 129, 0.15)' 
                  : 'rgba(16, 185, 129, 0.05)',
              color: isSelected ? 'white !important' : '#059669',
              transform: isSelected ? 'none' : 'translateX(4px)',
            },
            '&.Mui-selected': {
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%) !important',
              color: 'white !important',
              boxShadow: '0 4px 20px rgba(16,185,129,0.25) !important',
              '&:hover': {
                background: 'linear-gradient(135deg, #047857 0%, #059669 100%) !important',
                color: 'white !important',
              },
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            '& .MuiListItemIcon-root': {
              color: isSelected ? 'white !important' : '#059669',
              minWidth: isCollapsed ? 'auto' : { xs: 32, sm: 36, md: 40 },
            },
            '& .MuiListItemText-primary': {
              fontWeight: isSelected ? 600 : 500,
              fontSize: { xs: '0.875rem', sm: '0.9rem', md: '0.95rem' },
              color: isSelected ? 'white !important' : 'inherit',
            },
            '& .MuiListItemText-secondary': {
              color: isSelected ? 'rgba(255, 255, 255, 0.8) !important' : muiTheme.palette.text.secondary,
              fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
              display: isCollapsed ? 'none' : 'block',
            },
          }}
        >
          <ListItemIcon sx={{ mr: isCollapsed ? 0 : { xs: 1, sm: 1.5, md: 2 } }}>
            {item.icon}
          </ListItemIcon>
          {!isCollapsed && (
            <ListItemText 
              primary={item.text} 
              secondary={item.description}
            />
          )}
          {item.badge && !isCollapsed && (
            <Badge 
              badgeContent={item.badge} 
              color="error"
              sx={{ ml: 'auto' }}
            />
          )}
        </ListItem>
      </Tooltip>
    );
  };

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      background: muiTheme.palette.background.paper,
      borderRight: `1px solid ${muiTheme.palette.divider}`,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <Box sx={{ 
        p: { xs: 1.5, sm: 2, md: 3 }, 
        borderBottom: `1px solid ${muiTheme.palette.divider}`,
        background: muiTheme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
          : 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          mb: { xs: 1.5, sm: 2 },
          gap: sidebarCollapsed ? 3 : 0,
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 1.5, md: 2 },
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: { xs: 32, sm: 36, md: 40 },
              height: { xs: 32, sm: 36, md: 40 },
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            }}>
              <Star sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />
            </Box>
            {!sidebarCollapsed && (
              <Typography variant="h6" sx={{ 
                fontWeight: 700,
                color: muiTheme.palette.text.primary,
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Legacy Booth
              </Typography>
            )}
          </Box>
          {!isMobile && (
            <IconButton
              onClick={handleSidebarToggle}
              sx={{ 
                color: muiTheme.palette.mode === 'dark' ? 'inherit' : '#059669',
                background: muiTheme.palette.mode === 'dark' 
                  ? 'rgba(16, 185, 129, 0.15)' 
                  : 'rgba(16, 185, 129, 0.05)',
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 },
                '&:hover': {
                  background: muiTheme.palette.mode === 'dark' 
                    ? 'rgba(16, 185, 129, 0.25)' 
                    : 'rgba(16, 185, 129, 0.1)',
                },
              }}
            >
              {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>
          )}
        </Box>
        {!sidebarCollapsed && (
          <Typography variant="body2" sx={{ 
            color: '#059669',
            fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
            fontWeight: 600,
            textTransform: 'capitalize',
            letterSpacing: '0.025em'
          }}>
            Welcome Back, {user?.name || 'User'}
          </Typography>
        )}
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 0.5, sm: 1 } }}>
        <List>
          {user?.role === 'admin' ? (
            adminMenuItems.map(item => renderMenuItem(item, true))
          ) : (
            menuItems.map(item => renderMenuItem(item))
          )}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        p: { xs: 1, sm: 1.5, md: 2 }, 
        borderTop: `1px solid ${muiTheme.palette.divider}`,
        background: muiTheme.palette.mode === 'dark' ? '#1e293b' : '#f9fafb',
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1, sm: 1.5, md: 2 },
          mb: { xs: 1, sm: 1.5, md: 2 },
        }}>
          <Avatar 
            sx={{ 
              width: { xs: 28, sm: 32, md: 36 }, 
              height: { xs: 28, sm: 32, md: 36 },
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            }}
          >
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
          {!sidebarCollapsed && (
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ 
                fontWeight: 600, 
                color: muiTheme.palette.text.primary,
                fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }
              }}>
                {user?.name || 'User'}
              </Typography>
              <Typography variant="caption" sx={{ 
                color: muiTheme.palette.text.secondary,
                fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' }
              }}>
                {user?.role || 'User'}
              </Typography>
            </Box>
          )}
        </Box>
        {!sidebarCollapsed && (
          <Button
            fullWidth
            variant="outlined"
            onClick={handleLogout}
            startIcon={<Logout />}
            sx={{
              borderColor: muiTheme.palette.divider,
              color: muiTheme.palette.text.secondary,
              fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
              py: { xs: 0.5, sm: 0.75, md: 1 },
              '&:hover': {
                borderColor: '#ef4444',
                color: '#ef4444',
                background: muiTheme.palette.mode === 'dark' 
                  ? 'rgba(239, 68, 68, 0.15)' 
                  : 'rgba(239, 68, 68, 0.05)',
              },
            }}
          >
            Sign Out
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <style>{globalStyles}</style>
      
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        {/* App Bar */}
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            background: muiTheme.palette.background.paper,
            borderBottom: `1px solid ${muiTheme.palette.divider}`,
            boxShadow: muiTheme.palette.mode === 'dark' 
              ? '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)'
              : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            width: { 
              xs: '100%', 
              md: `calc(100% - ${sidebarCollapsed ? collapsedDrawerWidth : drawerWidth}px)` 
            },
            left: { xs: 0, md: sidebarCollapsed ? collapsedDrawerWidth : drawerWidth },
          }}
        >
          <Toolbar sx={{ px: { xs: 1, sm: 2, md: 3 }, minHeight: { xs: 56, sm: 64 } }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: { xs: 1, sm: 2 }, 
                display: { md: 'none' },
                color: muiTheme.palette.mode === 'dark' ? 'inherit' : '#059669',
              }}
            >
              <MenuIcon />
            </IconButton>
            
            <Typography variant="h6" sx={{ 
              flexGrow: 1, 
              color: muiTheme.palette.text.primary,
              fontWeight: 600,
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
              display: { xs: 'block', sm: 'block' }
            }}>
              {getPageTitle()}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
              <IconButton 
                onClick={toggleTheme}
                sx={{ 
                  color: muiTheme.palette.mode === 'dark' ? 'inherit' : '#059669',
                  display: { xs: 'none', sm: 'flex' }
                }}
              >
                {isDarkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
              <IconButton sx={{ 
                color: muiTheme.palette.mode === 'dark' ? 'inherit' : '#059669',
                display: { xs: 'none', sm: 'flex' }
              }}>
                <Search />
              </IconButton>
              <IconButton sx={{ 
                color: muiTheme.palette.mode === 'dark' ? 'inherit' : '#059669' 
              }}>
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{ 
                  color: muiTheme.palette.mode === 'dark' ? 'inherit' : '#059669' 
                }}
              >
                <Avatar 
                  sx={{ 
                    width: { xs: 28, sm: 32 }, 
                    height: { xs: 28, sm: 32 },
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: { xs: 180, sm: 200 },
              background: muiTheme.palette.background.paper,
              border: `1px solid ${muiTheme.palette.divider}`,
              boxShadow: muiTheme.palette.mode === 'dark' 
                ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
                : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          <MenuItem onClick={() => { navigate('/settings/profile'); handleProfileMenuClose(); }}>
            <ListItemIcon>
              <Person sx={{ color: '#059669' }} />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={() => { navigate('/settings/accessibility'); handleProfileMenuClose(); }}>
            <ListItemIcon>
              <Settings sx={{ color: '#059669' }} />
            </ListItemIcon>
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: '#ef4444' }}>
            <ListItemIcon>
              <Logout sx={{ color: '#ef4444' }} />
            </ListItemIcon>
            Sign Out
          </MenuItem>
        </Menu>

        {/* Drawer */}
        <Box
          component="nav"
          sx={{ 
            width: { 
              md: sidebarCollapsed ? collapsedDrawerWidth : drawerWidth 
            }, 
            flexShrink: { md: 0 } 
          }}
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
                width: { xs: '100%', sm: drawerWidth },
                background: muiTheme.palette.background.paper,
                borderRight: `1px solid ${muiTheme.palette.divider}`,
                boxSizing: 'border-box',
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
                width: sidebarCollapsed ? collapsedDrawerWidth : drawerWidth,
                background: muiTheme.palette.background.paper,
                borderRight: `1px solid ${muiTheme.palette.divider}`,
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxSizing: 'border-box',
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { 
              xs: '100%', 
              md: `calc(100% - ${sidebarCollapsed ? collapsedDrawerWidth : drawerWidth}px)` 
            },
            background: muiTheme.palette.background.default,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} />
          <Box sx={{ 
            flex: 1,
            p: { xs: 1, sm: 2, md: 3 },
            animation: 'fadeIn 0.5s ease-out',
            '@keyframes fadeIn': {
              '0%': { opacity: 0, transform: 'translateY(10px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Layout; 
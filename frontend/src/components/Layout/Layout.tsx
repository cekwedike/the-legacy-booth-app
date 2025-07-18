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
} from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

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

const drawerWidth = 320;
const collapsedDrawerWidth = 80;

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
  const navigate = useNavigate();
  const location = useLocation();

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
    const isSelected = location.pathname === item.path;
    const isCollapsed = sidebarCollapsed && !mobileOpen;

    return (
      <Tooltip 
        title={isCollapsed ? item.text : ''} 
        placement="right"
        disableHoverListener={!isCollapsed}
      >
        <ListItem
          key={item.text}
          onClick={() => navigate(item.path)}
          selected={isSelected}
          sx={{
            mx: isCollapsed ? 0.5 : 1.5,
            mb: 1.5,
            borderRadius: isCollapsed ? '12px' : '16px',
            p: isCollapsed ? 1.5 : 2.5,
            width: isCollapsed ? 'auto' : '92%',
            minHeight: isCollapsed ? 48 : 64,
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            background: isSelected 
              ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' 
              : 'transparent',
            color: isSelected ? 'white' : '#e5e7eb',
            boxShadow: isSelected 
              ? '0 4px 20px rgba(16,185,129,0.25)' 
              : 'none',
            '&:hover': {
              background: isSelected 
                ? 'linear-gradient(135deg, #047857 0%, #059669 100%)'
                : 'rgba(16, 185, 129, 0.1)',
              transform: isCollapsed ? 'scale(1.05)' : 'translateX(4px)',
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(5,150,105,0.1) 100%)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
            },
            '&:hover::before': {
              opacity: 1,
            },
            '& .MuiListItemIcon-root': {
              color: isSelected ? 'white' : '#10b981',
              minWidth: isCollapsed ? 'auto' : 44,
              marginRight: isCollapsed ? 0 : 3,
            },
            '& .MuiListItemText-root': {
              margin: 0,
            },
            '& .MuiListItemText-primary': {
              fontWeight: 600,
              fontSize: '0.95rem',
            },
            '& .MuiListItemText-secondary': {
              fontSize: '0.8rem',
              opacity: 0.8,
            },
          }}
        >
          <ListItemIcon sx={{ 
            minWidth: isCollapsed ? 'auto' : 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {item.icon}
          </ListItemIcon>
          
          {!isCollapsed && (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                  sx={{ 
                    '& .MuiBadge-badge': { 
                      fontSize: '0.7rem',
                      background: '#ef4444',
                      color: 'white'
                    } 
                  }}
                />
              )}
            </Box>
          )}
        </ListItem>
      </Tooltip>
    );
  };

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #064e3b 0%, #065f46 100%)',
      position: 'relative'
    }}>
      {/* Collapse Toggle Button */}
      <Tooltip title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'} placement="left" arrow>
        <IconButton
          onClick={handleSidebarToggle}
          sx={{
            position: 'absolute',
            top: 16,
            right: -16,
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            color: 'white',
            width: 32,
            height: 32,
            zIndex: 10,
            border: '2px solid rgba(255,255,255,0.2)',
            boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
              transform: 'scale(1.1)',
              boxShadow: '0 6px 16px rgba(16,185,129,0.4)',
            },
            transition: 'all 0.3s ease',
            display: { xs: 'none', md: 'flex' }
          }}
        >
          {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Tooltip>

      {/* Collapse Toggle Text */}
      {!sidebarCollapsed && (
        <Box sx={{
          position: 'absolute',
          top: 52,
          right: -8,
          background: 'rgba(16,185,129,0.9)',
          color: 'white',
          px: 1.5,
          py: 0.5,
          borderRadius: '12px',
          fontSize: '0.7rem',
          fontWeight: 600,
          zIndex: 10,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          whiteSpace: 'nowrap',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          Collapse
        </Box>
      )}
      
      {/* Expand Toggle Text */}
      {sidebarCollapsed && (
        <Box sx={{
          position: 'absolute',
          top: 52,
          right: -8,
          background: 'rgba(16,185,129,0.9)',
          color: 'white',
          px: 1.5,
          py: 0.5,
          borderRadius: '12px',
          fontSize: '0.7rem',
          fontWeight: 600,
          zIndex: 10,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          whiteSpace: 'nowrap',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          Expand
        </Box>
      )}

      {/* Header */}
      <Box sx={{ 
        p: sidebarCollapsed ? 2.5 : 4, 
        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: 20,
          height: 20,
          background: 'rgba(251, 191, 36, 0.3)',
          borderRadius: '50%',
          animation: 'float 3s ease-in-out infinite',
        }
      }}>
        {!sidebarCollapsed && (
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mb: 1
            }}>
              <Box sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(251, 191, 36, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                mr: 1.5,
                animation: 'pulse 2s ease-in-out infinite'
              }}>
                <Star sx={{ fontSize: 20, color: '#fbbf24' }} />
              </Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 800,
                fontSize: '1.1rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}>
                Navigation
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ 
              opacity: 0.8,
              fontSize: '0.7rem',
              letterSpacing: '0.05em'
            }}>
              Quick Access
            </Typography>
          </Box>
        )}
        {sidebarCollapsed && (
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(251, 191, 36, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              <Star sx={{ 
                fontSize: 16, 
                color: '#fbbf24',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
              }} />
            </Box>
          </Box>
        )}
      </Box>

      {/* User Info */}
      <Box sx={{ 
        p: sidebarCollapsed ? 2 : 3, 
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: sidebarCollapsed ? 0 : 2,
          justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
        }}>
          <Avatar 
            sx={{ 
              width: sidebarCollapsed ? 40 : 48, 
              height: sidebarCollapsed ? 40 : 48,
              background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
              fontSize: sidebarCollapsed ? '1rem' : '1.2rem',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(22,196,94,0.3)'
            }}
          >
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
          {!sidebarCollapsed && (
            <Box>
              <Typography variant="subtitle2" sx={{ 
                fontWeight: 600,
                color: '#ffffff',
                fontSize: '0.9rem'
              }}>
                {user?.name || 'User'}
              </Typography>
              <Chip 
                label={user?.role || 'resident'} 
                size="small" 
                sx={{ 
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  fontSize: '0.65rem',
                  height: 18,
                  fontWeight: 600
                }}
              />
            </Box>
          )}
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 2 }}>
        <List sx={{ pt: 0, px: 1 }}>
          {menuItems.map((item) => renderMenuItem(item))}
        </List>

        {user?.role === 'admin' && (
          <>
            {!sidebarCollapsed && (
              <Divider sx={{ 
                mx: 3, 
                my: 3,
                borderColor: 'rgba(255,255,255,0.1)',
                '&::before': {
                  borderTopColor: 'rgba(255,255,255,0.1)',
                }
              }} />
            )}
            {!sidebarCollapsed && (
              <Typography variant="overline" sx={{ 
                px: 4, 
                py: 1.5, 
                color: '#10b981', 
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: '0.1em'
              }}>
                Admin Tools
              </Typography>
            )}
            <List sx={{ pt: 0, px: 1 }}>
              {adminMenuItems.map((item) => renderMenuItem(item, true))}
            </List>
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <style>{globalStyles}</style>
      <Box sx={{ 
        display: 'flex', 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0a0a0f 0%, #064e3b 50%, #065f46 100%)' 
      }}>
      <AppBar
        position="fixed"
        sx={{
          width: { 
            md: `calc(100% - ${sidebarCollapsed ? collapsedDrawerWidth : drawerWidth}px)` 
          },
          ml: { 
            md: `${sidebarCollapsed ? collapsedDrawerWidth : drawerWidth}px` 
          },
          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
          boxShadow: '0 4px 20px rgba(16,185,129,0.15)',
          backdropFilter: 'blur(10px)',
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
              <Notifications />
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
                  background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
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
              boxSizing: 'border-box', 
              width: drawerWidth,
              background: 'linear-gradient(180deg, #064e3b 0%, #065f46 100%)',
              borderRight: 'none',
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
              width: sidebarCollapsed ? collapsedDrawerWidth : drawerWidth,
              background: 'linear-gradient(180deg, #064e3b 0%, #065f46 100%)',
              borderRight: 'none',
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              overflow: 'hidden',
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
          p: { xs: 1, sm: 2, md: 4 },
          width: { 
            md: `calc(100% - ${sidebarCollapsed ? collapsedDrawerWidth : drawerWidth}px)` 
          },
          mt: 10,
          minHeight: 'calc(100vh - 64px)',
          background: 'none',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Outlet />
      </Box>

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem onClick={() => { navigate('/settings/profile'); handleProfileMenuClose(); }}>
          <ListItemIcon><Person /></ListItemIcon> Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><Logout /></ListItemIcon> Logout
        </MenuItem>
      </Menu>
      </Box>
    </>
  );
};

export default Layout; 
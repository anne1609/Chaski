import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';

// Lightweight Unicode icons for better performance
const Icons = {
  Menu: '☰',
  Logout: '🚪',
  Person: '👤'
};

function NavBar() {
  const location = useLocation();
  const { pathname } = location;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Don't show navbar on login page
  if (pathname === '/login') {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavConfig = () => {
    if (!isAuthenticated) {
      return null;
    }
    
    return {
      text: user ? `${user.names} ${user.last_names}` : 'Usuario',
      role: user?.role === 'secretary' ? 'Secretaria' : 'Profesor'
    };
  };

  const currentNav = getNavConfig();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const secretaryMenuItems = [
    { to: '/secretary/messages', text: 'Lista de mensajes' },
    { to: '/secretary/notice', text: 'Crear Aviso' },
    { to: '/secretary/mails', text: 'Enviar Correos' },
  ];  const drawer = (
    <Box sx={{ width: 240 }}>
      <List>
        {/* User Info */}
        {currentNav && (
          <ListItem>
            <Box sx={{ width: '100%', textAlign: 'center', color: 'white', mb: 2 }}>
              <span style={{ fontSize: '40px', marginBottom: '8px', display: 'block' }}>{Icons.Person}</span>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {currentNav.text}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {currentNav.role}
              </Typography>
            </Box>
          </ListItem>
        )}
        
        {/* Menu Items */}
        {pathname === '/secretary' && secretaryMenuItems.map((item) => (
          <ListItem key={item.to} disablePadding>
            <ListItemButton 
              component={Link} 
              to={item.to}
              onClick={handleDrawerToggle}
              sx={{
                backgroundColor: '#1A6487',
                color: 'white',
                margin: 0.5,
                borderRadius: '8px',
                padding: '8px 12px',
                '&:hover': {
                  backgroundColor: '#144f6b',
                },
              }}
            >
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  textAlign: 'center',
                  '& .MuiListItemText-primary': {
                    fontSize: '14px'
                  }
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
        
        {/* Logout Button */}
        {isAuthenticated && (
          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => {
                handleLogout();
                handleDrawerToggle();
              }}
              sx={{
                backgroundColor: '#d32f2f',
                color: 'white',
                margin: 0.5,
                borderRadius: '8px',
                padding: '8px 12px',
                '&:hover': {
                  backgroundColor: '#b71c1c',
                },
              }}
            >
              <span style={{ marginRight: '8px', fontSize: '16px' }}>{Icons.Logout}</span>
              <ListItemText 
                primary="Cerrar Sesión" 
                sx={{ 
                  textAlign: 'center',
                  '& .MuiListItemText-primary': {
                    fontSize: '14px'
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#2C965A' }}>
        <Toolbar>
          {/* Logo/Brand */}
          <Typography
            variant="h4"
            component={Link}
            to="/"
            sx={{
              fontFamily: 'Jaro',
              fontSize: '30px',
              color: 'white',
              fontWeight: 'bold',
              textDecoration: 'none',
              flexGrow: isMobile ? 1 : 0,
            }}
          >
            Chasky
          </Typography>

          {/* Mobile Menu Button */}
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <span style={{ fontSize: '20px' }}>{Icons.Menu}</span>
            </IconButton>
          ) : (
            <>
              {/* Desktop Navigation - Center */}
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 1.5 }}>
                {pathname === '/secretary' && secretaryMenuItems.map((item) => (
                  <Button
                    key={item.to}
                    component={Link}
                    to={item.to}
                    sx={{
                      color: 'white',
                      fontSize: '14px',
                      borderRadius: '8px',
                      backgroundColor: '#1A6487',
                      minWidth: '200px',
                      padding: '6px 16px',
                      margin: '2px 4px',
                      '&:hover': {
                        backgroundColor: '#144f6b',
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>

              {/* Desktop Navigation - Right */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {currentNav && (
                  <>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>
                        {currentNav.role}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'white', fontSize: '14px' }}>
                        {currentNav.text}
                      </Typography>
                    </Box>
                    <Button
                      onClick={handleLogout}
                      sx={{
                        color: 'white',
                        fontSize: '14px',
                        borderRadius: '8px',
                        backgroundColor: '#d32f2f',
                        padding: '6px 16px',
                        '&:hover': {
                          backgroundColor: '#b71c1c',
                        },
                      }}
                    >
                      <span style={{ marginRight: '8px', fontSize: '16px' }}>{Icons.Logout}</span>
                      Cerrar Sesión
                    </Button>
                  </>
                )}
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 240,
            backgroundColor: '#2C965A',
            paddingTop: 2,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default NavBar;
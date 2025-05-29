import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
import MenuIcon from '@mui/icons-material/Menu';

function NavBar() {
  const location = useLocation();
  const { pathname } = location;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const navConfig = {
    '/': { to: '/login', text: 'Login' },
    '/secretary': { to: '/login', text: 'Cerrar Sesion' },
    '/teacher': { to: '/login', text: 'Cerrar Sesion' },
  };

  const currentNav = navConfig[pathname];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const secretaryMenuItems = [
    { to: '/secretary/messages', text: 'Lista de mensajes' },
    { to: '/secretary/notice', text: 'Crear Aviso' },
    { to: '/secretary/mails', text: 'Enviar Correos' },
  ];

  const drawer = (
    <Box sx={{ width: 240 }}>
      <List>
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
        {currentNav && (
          <ListItem disablePadding>
            <ListItemButton 
              component={Link} 
              to={currentNav.to}
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
                primary={currentNav.text} 
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
              <MenuIcon />
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
              <Box>
                {currentNav && (
                  <Button
                    component={Link}
                    to={currentNav.to}
                    sx={{
                      color: 'white',
                      fontSize: '14px',
                      borderRadius: '8px',
                      backgroundColor: '#1A6487',
                      padding: '6px 16px',
                      '&:hover': {
                        backgroundColor: '#144f6b',
                      },
                    }}
                  >
                    {currentNav.text}
                  </Button>
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
import { Outlet } from 'react-router-dom';
import './App.css';
import AppRoutes from './router/index';
import NavBar from './components/NavBar';
import Login from './components/Login';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from './contexts/AuthContext';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <NavBar />
        <Outlet />
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

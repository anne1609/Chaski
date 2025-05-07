import { Outlet } from 'react-router-dom';
import './App.css';
import AppRoutes from './router/index';
import NavBar from './components/NavBar';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
function App() {

  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      <Outlet />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;

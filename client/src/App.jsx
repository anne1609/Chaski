import { Outlet } from 'react-router-dom';
import './App.css';
import AppRoutes from './router/index';
import NavBar from './components/NavBar';

function App() {

  return (
    <>
      <NavBar />
      <Outlet />
      <AppRoutes />
    </>
  );
}

export default App;

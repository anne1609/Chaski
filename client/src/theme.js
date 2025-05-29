
import { textFieldClasses } from '@mui/material';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1A6487', 
    },
    secondary: {
      main: '#0A3359',
    },
    tertiary: {
      main: '#2C965A', 
    },
    negative: {
      main: '#011408',
      contrastText: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default theme;
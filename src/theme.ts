import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // Use 'light' para roxo com branco
    primary: {
      main: '#673ab7', // Roxo principal
    },
    secondary: {
      main: '#9c27b0', // Roxo secundário
    },
    background: {
      default: '#121212', // Preto ou cinza escuro
      paper: '#1e1e1e', // Cinza escuro para elementos
    },
    text: {
      primary: '#ffffff', // Branco para texto
      secondary: '#bdbdbd', // Cinza claro para texto secundário
    },
  },
});

export default theme;

import { MovieBrowser } from '@/containers/MovieBrowser';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <MovieBrowser />
    </ThemeProvider>
  );
}

export default App;

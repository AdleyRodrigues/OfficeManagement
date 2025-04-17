import AssignmentIcon from '@mui/icons-material/Assignment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import {
  AppBar,
  Box,
  Button,
  Container,
  createTheme,
  CssBaseline,
  IconButton,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React from 'react';
import { Link, BrowserRouter as Router, useLocation } from 'react-router-dom';
import AppRoutes from './routes';

// Definição do tema
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Componente para os botões de navegação
const NavButton = ({ to, label, icon, currentPath }: { to: string, label: string, icon: React.ReactNode, currentPath: string }) => {
  const isActive = currentPath === to;

  return (
    <Button
      color="inherit"
      component={Link}
      to={to}
      sx={{
        mx: 1,
        fontWeight: isActive ? 700 : 500,
        borderBottom: isActive ? '3px solid white' : 'none',
        borderRadius: '0',
        paddingBottom: '6px',
        '&:hover': {
          borderBottom: '3px solid rgba(255, 255, 255, 0.7)',
        }
      }}
      startIcon={icon}
    >
      {label}
    </Button>
  );
};

// Componente para o AppBar responsivo
const ResponsiveAppBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Box sx={{ mr: 2 }}>
          <AssignmentIcon />
        </Box>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Sistema de Ofícios
        </Typography>

        {isMobile ? (
          // Versão mobile: apenas ícones
          <Box>
            <Tooltip title="Lista de Ofícios">
              <IconButton
                color="inherit"
                component={Link}
                to="/oficios"
                sx={{
                  color: currentPath === '/oficios' ? 'white' : 'rgba(255, 255, 255, 0.7)',
                }}
              >
                <ListAltIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          // Versão desktop: botões com texto
          <Box>
            <NavButton
              to="/oficios"
              label="Lista de Ofícios"
              icon={<ListAltIcon />}
              currentPath={currentPath}
            />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppContent />
        </Box>
      </Router>
    </ThemeProvider>
  );
};

// Componente de conteúdo com o AppBar
const AppContent = () => {
  return (
    <>
      <ResponsiveAppBar />

      <Container component="main" sx={{ flexGrow: 1, pt: 3, pb: 4 }}>
        <AppRoutes />
      </Container>

      <Box component="footer" sx={{ py: 2, bgcolor: 'background.paper', textAlign: 'center', borderTop: '1px solid #e0e0e0' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Sistema de Gerenciamento de Ofícios
        </Typography>
      </Box>
    </>
  );
};

export default App;

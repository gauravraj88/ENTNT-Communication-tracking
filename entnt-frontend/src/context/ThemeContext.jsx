import React, { createContext, useState, useMemo, useContext } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

export const ColorModeContext = createContext({ toggleColorMode: () => { } });

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
              // Light mode
              primary: {
                main: '#2196f3',
                dark: '#1976d2',
                light: '#64b5f6',
              },
              secondary: {
                main: '#764ba2',
              },
              background: {
                default: '#f5f5f5',
                paper: '#ffffff',
              },
              error: {
                main: '#f44336',
                light: '#ffebee',
              },
              success: {
                main: '#4caf50',
                light: '#e8f5e9',
              },
              warning: {
                main: '#ff9800',
                light: '#fff3e0',
              },
              divider: 'rgba(0, 0, 0, 0.12)',
            }
            : {
              // Dark mode
              primary: {
                main: '#90caf9',
                dark: '#42a5f5',
                light: '#e3f2fd',
              },
              secondary: {
                main: '#ce93d8',
              },
              background: {
                default: '#121212',
                paper: '#1e1e1e',
              },
              error: {
                main: '#f44336',
                light: 'rgba(244, 67, 54, 0.15)',
              },
              success: {
                main: '#4caf50',
                light: 'rgba(76, 175, 80, 0.15)',
              },
              warning: {
                main: '#ff9800',
                light: 'rgba(255, 152, 0, 0.15)',
              },
              divider: 'rgba(255, 255, 255, 0.12)',
            }),
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: 8,
              },
            },
          },
          MuiDataGrid: {
            styleOverrides: {
              root: {
                border: 'none',
                '& .MuiDataGrid-cell': {
                  borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
                  borderBottom: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'}`,
                },
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const useThemeContext = () => {
  return useContext(ColorModeContext);
};
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const AppThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Save preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // Update document class for global CSS
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#059669',
        light: '#10b981',
        dark: '#047857',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#16a34a',
        light: '#22c55e',
        dark: '#15803d',
        contrastText: '#ffffff',
      },
      background: {
        default: isDarkMode ? '#0f172a' : '#f9fafb',
        paper: isDarkMode ? '#1e293b' : '#ffffff',
      },
      text: {
        primary: isDarkMode ? '#f1f5f9' : '#1f2937',
        secondary: isDarkMode ? '#94a3b8' : '#6b7280',
      },
      divider: isDarkMode ? '#334155' : '#e5e7eb',
      action: {
        hover: isDarkMode ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.04)',
        selected: isDarkMode ? 'rgba(16, 185, 129, 0.16)' : 'rgba(16, 185, 129, 0.08)',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 800,
        color: isDarkMode ? '#f1f5f9' : '#1f2937',
      },
      h2: {
        fontWeight: 700,
        color: isDarkMode ? '#f1f5f9' : '#1f2937',
      },
      h3: {
        fontWeight: 600,
        color: isDarkMode ? '#f1f5f9' : '#1f2937',
      },
      h4: {
        fontWeight: 600,
        color: isDarkMode ? '#f1f5f9' : '#1f2937',
      },
      h5: {
        fontWeight: 600,
        color: isDarkMode ? '#f1f5f9' : '#1f2937',
      },
      h6: {
        fontWeight: 600,
        color: isDarkMode ? '#f1f5f9' : '#1f2937',
      },
      body1: {
        color: isDarkMode ? '#e2e8f0' : '#374151',
      },
      body2: {
        color: isDarkMode ? '#cbd5e1' : '#6b7280',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDarkMode ? '#0f172a' : '#f9fafb',
            color: isDarkMode ? '#f1f5f9' : '#1f2937',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
            borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e5e7eb'}`,
            boxShadow: isDarkMode 
              ? '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)'
              : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
            borderRight: `1px solid ${isDarkMode ? '#334155' : '#e5e7eb'}`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
            border: `1px solid ${isDarkMode ? '#334155' : '#e5e7eb'}`,
            boxShadow: isDarkMode 
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              background: isDarkMode ? '#334155' : '#f0fdf4',
              borderRadius: 12,
              '& fieldset': {
                borderColor: isDarkMode ? '#475569' : '#e5e7eb',
              },
              '&:hover fieldset': {
                borderColor: '#10b981',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#059669',
                borderWidth: '2px',
              },
              '& input': {
                color: isDarkMode ? '#f1f5f9' : '#1f2937',
                padding: '16px 14px',
                background: 'transparent',
                '&::placeholder': {
                  color: isDarkMode ? '#94a3b8' : '#059669',
                  opacity: 0.7,
                },
              },
              '& textarea': {
                color: isDarkMode ? '#f1f5f9' : '#1f2937',
                padding: '16px 14px',
                background: 'transparent',
                '&::placeholder': {
                  color: isDarkMode ? '#94a3b8' : '#059669',
                  opacity: 0.7,
                },
              },
            },
            '& .MuiInputLabel-root': {
              color: isDarkMode ? '#94a3b8' : '#6b7280',
              '&.Mui-focused': {
                color: '#059669',
              },
            },
            '& .MuiInputAdornment-root': {
              color: '#059669',
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            '& .MuiSelect-select': {
              color: isDarkMode ? '#f1f5f9' : '#1f2937',
              fontWeight: 600,
              fontSize: '0.95rem',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isDarkMode ? '#475569' : '#e5e7eb',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#10b981',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#059669',
              borderWidth: '2px',
            },
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: isDarkMode ? '#f1f5f9' : '#1f2937',
            fontWeight: 500,
            fontSize: '0.95rem',
            '&:hover': {
              background: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
            },
            '&.Mui-selected': {
              background: isDarkMode ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.2)',
              color: '#059669',
              fontWeight: 600,
              '&:hover': {
                background: isDarkMode ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.25)',
              },
            },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            '&.MuiOutlinedInput-root': {
              background: isDarkMode ? '#334155' : '#f0fdf4',
              '&:hover': {
                background: isDarkMode ? '#334155' : '#f0fdf4',
              },
              '&.Mui-focused': {
                background: isDarkMode ? '#334155' : '#f0fdf4',
              },
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 12,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: isDarkMode ? '#f1f5f9' : '#059669',
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
              '&:hover': {
                backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.15)',
              },
            },
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.04)',
            },
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: isDarkMode ? '#334155' : '#e5e7eb',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? '#334155' : '#f3f4f6',
            color: isDarkMode ? '#f1f5f9' : '#374151',
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? '#334155' : '#f3f4f6',
          },
        },
      },
    },
  });

  const contextValue: ThemeContextType = {
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}; 
import { createTheme, Theme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface CustomThemeProperties {
    headerHeight: number;
    sidebarWidth: number;
    sidebarCollapsedWidth: number;
  }

  interface Theme {
    custom: {
      layout: CustomThemeProperties;
      status: {
        online: string;
        offline: string;
        busy: string;
      };
      gradients: {
        primary: string;
        secondary: string;
        success: string;
        warning: string;
        error: string;
      };
    };
  }
  
  interface ThemeOptions {
    custom?: {
      layout?: Partial<CustomThemeProperties>;
      status?: {
        online?: string;
        offline?: string;
        busy?: string;
      };
      gradients?: {
        primary?: string;
        secondary?: string;
        success?: string;
        warning?: string;
        error?: string;
      };
    };
  }
}

const baseTheme: ThemeOptions = {
  custom: {
    layout: {
      headerHeight: 64,
      sidebarWidth: 240,
      sidebarCollapsedWidth: 64,
    },
    status: {
      online: '#48BB78',
      offline: '#F56565',
      busy: '#F6AD55',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #4FD1C5 0%, #38B2AC 100%)',
      secondary: 'linear-gradient(135deg, #FC8181 0%, #F56565 100%)',
      success: 'linear-gradient(135deg, #48BB78 0%, #38A169 100%)',
      warning: 'linear-gradient(135deg, #F6AD55 0%, #ED8936 100%)',
      error: 'linear-gradient(135deg, #F56565 0%, #E53E3E 100%)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#4FD1C5',
      light: '#66E2D5',
      dark: '#38B2AC',
    },
    secondary: {
      main: '#FC8181',
      light: '#FEB2B2',
      dark: '#F56565',
    },
    background: {
      default: '#F7FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2D3748',
      secondary: '#4A5568',
    },
    divider: '#E2E8F0',
    error: {
      main: '#F56565',
      light: '#FEB2B2',
      dark: '#E53E3E',
    },
    success: {
      main: '#48BB78',
      light: '#9AE6B4',
      dark: '#38A169',
    },
    warning: {
      main: '#F6AD55',
      light: '#FBD38D',
      dark: '#ED8936',
    },
    info: {
      main: '#63B3ED',
      light: '#90CDF4',
      dark: '#4299E1',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          '&.MuiButton-containedPrimary': {
            background: 'linear-gradient(135deg, #4FD1C5 0%, #38B2AC 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #66E2D5 0%, #4FD1C5 100%)',
            },
          },
          '&.MuiButton-containedSecondary': {
            background: 'linear-gradient(135deg, #FC8181 0%, #F56565 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #FEB2B2 0%, #FC8181 100%)',
            },
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#F8F9FA',
          '& .MuiTableCell-root': {
            color: '#2D3748',
            fontWeight: 600,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(79, 209, 197, 0.08) !important',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#FFFFFF',
          },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#4FD1C5',
      light: '#66E2D5',
      dark: '#38B2AC',
    },
    secondary: {
      main: '#FC8181',
      light: '#FEB2B2',
      dark: '#F56565',
    },
    background: {
      default: '#1A202C',
      paper: '#242C3D',
    },
    text: {
      primary: '#F7FAFC',
      secondary: '#E2E8F0',
    },
    divider: '#2D3748',
    error: {
      main: '#F56565',
      light: '#FEB2B2',
      dark: '#E53E3E',
    },
    success: {
      main: '#48BB78',
      light: '#9AE6B4',
      dark: '#38A169',
    },
    warning: {
      main: '#F6AD55',
      light: '#FBD38D',
      dark: '#ED8936',
    },
    info: {
      main: '#63B3ED',
      light: '#90CDF4',
      dark: '#4299E1',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 8,
          border: '1px solid #2D3748',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          '&.MuiButton-containedPrimary': {
            background: 'linear-gradient(135deg, #4FD1C5 0%, #38B2AC 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #66E2D5 0%, #4FD1C5 100%)',
            },
          },
          '&.MuiButton-containedSecondary': {
            background: 'linear-gradient(135deg, #FC8181 0%, #F56565 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #FEB2B2 0%, #FC8181 100%)',
            },
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#2D3748',
          '& .MuiTableCell-root': {
            color: '#E2E8F0',
            fontWeight: 600,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(79, 209, 197, 0.08) !important',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#242C3D',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#4A5568',
        },
      },
    },
  },
});

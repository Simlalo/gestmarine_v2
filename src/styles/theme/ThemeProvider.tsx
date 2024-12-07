import React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { GlobalStyles } from '@mui/material';
import { theme } from './theme';

interface ThemeProviderProps {
    children: React.ReactNode;
}

// Global style overrides
const globalStyles = {
    '*': {
        boxSizing: 'border-box',
        margin: 0,
        padding: 0,
    },
    html: {
        WebkitTextSizeAdjust: '100%',
        scrollBehavior: 'smooth',
        '@media (prefers-reduced-motion: reduce)': {
            scrollBehavior: 'auto',
            '&:focus-within': {
                scrollBehavior: 'auto',
            },
        },
    },
    body: {
        minHeight: '100vh',
        textRendering: 'optimizeSpeed',
        lineHeight: 1.5,
    },
    'ul, ol': {
        listStyle: 'none',
    },
    'img, picture': {
        maxWidth: '100%',
        display: 'block',
    },
    'input, button, textarea, select': {
        font: 'inherit',
    },
    button: {
        border: 'none',
        background: 'none',
        padding: 0,
        cursor: 'pointer',
        font: 'inherit',
    },
    '@media (prefers-reduced-motion: reduce)': {
        '*': {
            animationDuration: '0.01ms !important',
            animationIterationCount: '1 !important',
            transitionDuration: '0.01ms !important',
            scrollBehavior: 'auto !important',
        },
    },
};

// CssBaseline customization
const cssBaselineOverrides = {
    styleOverrides: {
        root: {
            // Add any CssBaseline root overrides here
        },
        body: {
            // Add any CssBaseline body overrides here
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
        },
    },
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline enableColorScheme {...cssBaselineOverrides} />
            <GlobalStyles styles={globalStyles} />
            {children}
        </MuiThemeProvider>
    );
};

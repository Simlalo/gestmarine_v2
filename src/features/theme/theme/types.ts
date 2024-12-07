import { Theme as MuiTheme, PaletteOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
  }

  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
  }

  interface Theme extends MuiTheme {
    custom: {
      layout: {
        sidebarWidth: number;
        sidebarCollapsedWidth: number;
        headerHeight: number;
      };
    };
  }

  interface ThemeOptions {
    custom?: {
      layout?: {
        sidebarWidth?: number;
        sidebarCollapsedWidth?: number;
        headerHeight?: number;
      };
    };
  }
}

export {};

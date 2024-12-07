import { createTheme, Theme } from '@mui/material/styles';
import { baseTheme } from './base';
import { lightPalette } from './light';
import { darkPalette } from './dark';
import './types';  // Import types to ensure they are included

export const lightTheme = createTheme({
  ...baseTheme,
  palette: lightPalette,
}) as Theme;

export const darkTheme = createTheme({
  ...baseTheme,
  palette: darkPalette,
}) as Theme;

export type { Theme };

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemeTransitionProps {
  children: React.ReactNode;
}

export const ThemeTransition: React.FC<ThemeTransitionProps> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div
      className="theme-transition"
      style={{
        transition: 'background-color var(--transition-normal) var(--transition-timing), color var(--transition-normal) var(--transition-timing)',
      }}
      data-theme={theme}
    >
      {children}
    </div>
  );
};

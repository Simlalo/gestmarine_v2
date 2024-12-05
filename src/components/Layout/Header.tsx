import React from 'react';
import { useTheme } from '@mui/material';
import { UserProfile } from '../auth/UserProfile';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { styled } from '@mui/material/styles';

interface HeaderProps {
  sidebarWidth?: string;
}

const StyledHeader = styled('header')<{ $sidebarWidth: string }>`
  position: fixed;
  top: 0;
  right: 0;
  left: ${props => props.$sidebarWidth};
  height: var(--header-height);
  background-color: ${props => props.theme.palette.background.paper};
  border-bottom: 1px solid ${props => props.theme.palette.divider};
  z-index: 1000;
`;

const HeaderContent = styled('div')`
  /* existing styles */
`;

export const Header: React.FC<HeaderProps> = ({ sidebarWidth = 'var(--sidebar-width)' }) => {
  const theme = useTheme();

  return (
    <StyledHeader $sidebarWidth={sidebarWidth}>
      <HeaderContent>
        <ThemeToggle />
        <UserProfile />
      </HeaderContent>
    </StyledHeader>
  );
};

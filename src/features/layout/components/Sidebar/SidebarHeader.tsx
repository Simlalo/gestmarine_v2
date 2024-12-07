import React from 'react';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import MenuIcon from '@mui/icons-material/Menu';
import {
  HeaderContainer,
  BrandContainer,
  BrandIcon,
  BrandText,
  HeaderToggle
} from '../styled/navigation';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  onToggleCollapse
}) => {
  return (
    <HeaderContainer>
      <BrandContainer>
        <BrandIcon>
          <DirectionsBoatIcon />
        </BrandIcon>
        {!isCollapsed && (
          <BrandText variant="h6">
            GestMarine
          </BrandText>
        )}
      </BrandContainer>
      <HeaderToggle
        onClick={onToggleCollapse}
        edge="end"
        aria-label="Toggle sidebar"
      >
        <MenuIcon />
      </HeaderToggle>
    </HeaderContainer>
  );
};

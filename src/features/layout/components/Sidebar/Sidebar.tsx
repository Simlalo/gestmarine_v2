import React, { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { List, useTheme, useMediaQuery, ListItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useAuth } from '../../hooks/useAuth';
import { SidebarHeader } from './SidebarHeader';
import { MENU_ITEMS } from '../../config/menuItems';
import { StyledSidebar, SidebarContent, ToggleButton } from '../styled/navigation';

interface SidebarProps {
  className?: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = React.memo(({ 
  className = '', 
  isCollapsed,
  onToggleCollapse 
}) => {
  const location = useLocation();
  const { hasPermission } = useAuth();
  const theme = useTheme();
  const isUnder900px = useMediaQuery('(max-width:900px)');

  const filteredMenuItems = useMemo(() => 
    MENU_ITEMS.filter(item => {
      if (!item.role?.length) return true;
      return item.role.some(role => hasPermission([role]));
    }), [hasPermission]
  );

  const renderMenuItem = (item: typeof MENU_ITEMS[0]) => {
    const isSelected = location.pathname === item.path;
    const Icon = item.icon;
    
    const menuItem = (
      <ListItem
        key={item.path}
        component={Link}
        to={item.path}
        selected={isSelected}
        sx={{
          borderRadius: 1,
          mb: 0.5,
          color: 'var(--text-primary)',
          '&.Mui-selected': {
            backgroundColor: 'var(--bg-selected)',
            '&:hover': {
              backgroundColor: 'var(--bg-selected-hover)',
            },
          },
        }}
      >
        <ListItemIcon sx={{ color: 'inherit', minWidth: isCollapsed ? 'auto' : 40 }}>
          <Icon />
        </ListItemIcon>
        {!isCollapsed && (
          <ListItemText 
            primary={item.title}
            sx={{
              '& .MuiListItemText-primary': {
                color: 'var(--text-primary)',
              },
            }}
          />
        )}
      </ListItem>
    );

    return isCollapsed ? (
      <Tooltip key={item.path} title={item.title} placement="right">
        {menuItem}
      </Tooltip>
    ) : menuItem;
  };

  return (
    <StyledSidebar
      component="aside"
      role="navigation"
      aria-label="Menu principal"
      className={className}
      isCollapsed={isCollapsed}
    >
      <SidebarHeader 
        isCollapsed={isCollapsed} 
        onToggleCollapse={onToggleCollapse} 
      />
      {!isUnder900px && (
        <ToggleButton
          onClick={onToggleCollapse}
          aria-label="Réduire le menu"
        >
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </ToggleButton>
      )}
      <SidebarContent>
        <List component="nav">
          {filteredMenuItems.map(renderMenuItem)}
        </List>
      </SidebarContent>
    </StyledSidebar>
  );
});
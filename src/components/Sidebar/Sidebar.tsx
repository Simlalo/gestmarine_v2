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
        <List>
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            const menuItem = (
              <Link 
                to={item.path} 
                key={item.path} 
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <ListItem
                  button
                  selected={isActive}
                  sx={{
                    minHeight: 48,
                    justifyContent: isCollapsed ? 'center' : 'initial',
                    px: 2.5,
                    borderRadius: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: 'action.selected',
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isCollapsed ? 0 : 2,
                      justifyContent: 'center',
                      color: isActive ? 'primary.main' : 'inherit'
                    }}
                  >
                    <Icon />
                  </ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText 
                      primary={item.title}
                      sx={{
                        opacity: isCollapsed ? 0 : 1,
                        color: isActive ? 'primary.main' : 'inherit'
                      }}
                    />
                  )}
                </ListItem>
              </Link>
            );

            return isCollapsed ? (
              <Tooltip key={item.path} title={item.title} placement="right">
                {menuItem}
              </Tooltip>
            ) : menuItem;
          })}
        </List>
      </SidebarContent>
    </StyledSidebar>
  );
});
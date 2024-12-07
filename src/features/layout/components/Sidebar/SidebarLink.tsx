import React from 'react';
import { Link } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';

const StyledListItem = styled(ListItem)<{ active: number }>(({ theme, active }) => ({
  margin: '4px 8px',
  padding: '8px 16px',
  borderRadius: theme.shape.borderRadius,
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  backgroundColor: active ? theme.palette.action.selected : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledListItemIcon = styled(ListItemIcon)({
  minWidth: 40,
});

interface SidebarLinkProps {
  title: string;
  icon: React.ReactNode;
  path: string;
  isActive: boolean;
  isCollapsed: boolean;
}

export const SidebarLink: React.FC<SidebarLinkProps> = ({
  title,
  icon,
  path,
  isActive,
  isCollapsed
}) => {
  const linkContent = (
    <StyledListItem button active={isActive ? 1 : 0}>
      <StyledListItemIcon>
        {icon}
      </StyledListItemIcon>
      {!isCollapsed && (
        <ListItemText 
          primary={title}
          primaryTypographyProps={{
            style: {
              fontWeight: 500,
              fontSize: '0.95rem',
            }
          }}
        />
      )}
    </StyledListItem>
  );

  return (
    <Link to={path} style={{ textDecoration: 'none' }}>
      {isCollapsed ? (
        <Tooltip title={title} placement="right">
          {linkContent}
        </Tooltip>
      ) : (
        linkContent
      )}
    </Link>
  );
};
